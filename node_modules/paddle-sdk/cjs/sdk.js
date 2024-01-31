"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaddleRequestError = exports.PaddleSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const serialize_1 = __importDefault(require("./serialize"));
const version_1 = require("./version");
const VENDOR_SANDBOX_URL = 'https://sandbox-vendors.paddle.com/api/2.0';
const VENDOR_SERVER_URL = 'https://vendors.paddle.com/api/2.0';
const CHECKOUT_SANDBOX_V1_URL = 'https://sandbox-checkout.paddle.com/api/1.0';
const CHECKOUT_SERVER_V1_URL = 'https://checkout.paddle.com/api/1.0';
const CHECKOUT_SANDBOX_V2_URL = 'https://sandbox-checkout.paddle.com/api/2.0';
const CHECKOUT_SERVER_V2_URL = 'https://checkout.paddle.com/api/2.0';
class PaddleSDK {
    /**
     * @param vendorID The vendor ID for a Paddle account
     * @param apiKey The API key for a Paddle account
     * @param publicKey The public key for a Paddle account used to verify webhooks, only required for {@link verifyWebhookData}
     *
     * @example
     * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key');
     * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
     */
    constructor(vendorID, apiKey, publicKey, options) {
        this.vendorID = vendorID || 'MISSING';
        this.apiKey = apiKey || 'MISSING';
        this.publicKey = publicKey || 'MISSING';
        this.options = options;
    }
    /**
     * Get the current list of products.
     *
     * API documentation: https://developer.paddle.com/api-reference/0f31bd7cbce47-list-products
     *
s	 * @example
     * const products = await client.getProducts();
     */
    getProducts() {
        return this._request('/product/get_products');
    }
    /**
     * Get the current list of coupons for a product.
     *
     * API documentation: https://developer.paddle.com/api-reference/6a59b795bd653-list-coupons
     *
     * @example
     * const coupons = await client.getProductCoupons(123);
     */
    getProductCoupons(productID) {
        return this._request('/product/list_coupons', {
            body: { product_id: productID },
        });
    }
    /**
     * Get a list of all the available subscription plans.
     *
     * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
     *
     * @example
     * const plans = await client.getSubscriptionPlans();
     */
    getSubscriptionPlans() {
        return this._request('/subscription/plans');
    }
    /**
     * Get the plan based on its ID.
     *
     * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
     *
     * @example
     * const plan = await client.getSubscriptionPlan(123);
     */
    async getSubscriptionPlan(planID) {
        return this._first(await this._request('/subscription/plans', {
            body: { plan: planID },
        }));
    }
    /**
     * Get the list of all payments or payments for a subscription plan.
     *
     * API documentation: https://developer.paddle.com/api-reference/80462f27b2011-list-payments
     *
     * @example
     * const payments = await client.getSubscriptionPayments();
     * const payments = await client.getSubscriptionPayments({ subscriptionID: 123 });
     * Legacy usage for backwards compatibility: pass planID as a number instead of options object
     * const payments = await client.getSubscriptionPayments(123);
     */
    getSubscriptionPayments(options) {
        if (typeof options === 'number') {
            console.warn('Passing planID as a number is deprecated, please use an options object instead');
        }
        const opts = typeof options === 'number' ? { planID: options } : options;
        const { planID = null, subscriptionID = null, isPaid = null, from = null, to = null, isOneOffCharge = null, } = opts || {};
        return this._request('/subscription/payments', {
            body: {
                ...(planID && { plan: planID }),
                ...(subscriptionID && { subscription_id: subscriptionID }),
                ...(typeof isPaid === 'boolean' && { is_paid: Number(isPaid) }),
                ...(from && { from: from.toISOString().substring(0, 10) }),
                ...(to && { to: to.toISOString().substring(0, 10) }),
                ...(typeof isOneOffCharge === 'boolean' && {
                    is_one_off_charge: Number(isOneOffCharge),
                }),
            },
        });
    }
    /**
     * Get the list of latest webhooks history.
     *
     * API documentation: https://developer.paddle.com/api-reference/7695d655c158b-get-webhook-history
     *
     * @example
     * const webhooksHistory = await client.getWebhooksHistory();
     */
    getWebhooksHistory() {
        return this._request('/alert/webhooks');
    }
    /**
     * Get the list of transactions for a user.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const userTransactions = await client.getUserTransactions(123);
     * const userTransactionsNext = await client.getUserTransactions(123, 2);
     */
    getUserTransactions(userID, page) {
        return this._getTransactions('user', userID, page);
    }
    /**
     * Get the list of transactions for a subscription.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
=	 * @example
     * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
     * const subscriptionTransactionsNext = await client.getSubscriptionTransactions(123, 2);
     */
    getSubscriptionTransactions(subscriptionID, page) {
        return this._getTransactions('subscription', subscriptionID, page);
    }
    /**
     * Get the list of transactions for an order.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const orderTransactions = await client.getOrderTransactions(123);
     * const orderTransactionsNext = await client.getOrderTransactions(123, 2);
     */
    getOrderTransactions(orderID, page) {
        return this._getTransactions('order', orderID, page);
    }
    /**
     * Get the list of transactions for a checkout.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const checkoutTransactions = await client.getCheckoutTransactions('123');
     * const checkoutTransactionsNext = await client.getCheckoutTransactions('123', 2);
     */
    getCheckoutTransactions(checkoutID, page) {
        return this._getTransactions('checkout', checkoutID, page);
    }
    /**
     * Get the list of transactions for a product.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const productTransactions = await client.getProductTransactions(123);
     * const productTransactionsNext = await client.getProductTransactions(123, 2);
     */
    getProductTransactions(productID, page) {
        return this._getTransactions('product', productID, page);
    }
    /**
     * Verify a webhook alert data using signature and a public key to validate that
     * it was indeed sent from Paddle.
     *
     * For more details: https://paddle.com/docs/reference-verifying-webhooks
     *
     * @param postData The object with all the parameters sent to the webhook
     *
     * @example
     * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
     *
     * // inside an Express handler which uses express.bodyParser middleware
     * const isVerified = client.verifyWebhookData(req.body);
     */
    verifyWebhookData(postData) {
        const signature = postData.p_signature;
        const keys = Object.keys(postData)
            .filter((key) => key !== 'p_signature')
            .sort();
        const sorted = {};
        keys.forEach((key) => {
            sorted[key] = postData[key];
        });
        // PHP style serialize! :O
        const serialized = (0, serialize_1.default)(sorted);
        try {
            const verifier = crypto_1.default.createVerify('sha1');
            verifier.write(serialized);
            verifier.end();
            return verifier.verify(this.publicKey, signature, 'base64');
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Update subscription details, quantity, price and or currency.
     *
     * API documentation: https://developer.paddle.com/api-reference/e3872343dfbba-update-user
     *
     * @example
     * const result = await client.updateSubscriptionPlan(123, { quantity: 2 });
     */
    updateSubscription(subscriptionID, postData) {
        const { quantity, price, planID, currency, prorate, keepModifiers, billImmediately, passthrough, pause, } = postData;
        const body = {
            subscription_id: subscriptionID,
            ...(currency && { currency }),
            ...(passthrough && { passthrough }),
            ...(typeof keepModifiers === 'boolean' && {
                keep_modifiers: keepModifiers,
            }),
            ...(typeof billImmediately === 'boolean' && {
                bill_immediately: billImmediately,
            }),
            ...(quantity && { quantity }),
            ...(typeof pause === 'boolean' && { pause }),
            ...(planID && { plan_id: planID }),
            ...(price && { recurring_price: price }),
            ...(typeof prorate === 'boolean' && { prorate }),
        };
        return this._request('/subscription/users/update', {
            body,
        });
    }
    /**
     * Cancels an active subscription.
     *
     * API documentation: https://developer.paddle.com/api-reference/9b808453c3216-cancel-user
     *
     * @example
     * const result = await client.cancelSubscription(123);
     */
    cancelSubscription(subscriptionID) {
        return this._request('/subscription/users_cancel', {
            body: { subscription_id: subscriptionID },
        });
    }
    /**
     * Get the current list of all users or users for a subscription plan.
     *
     * API documentation: https://developer.paddle.com/api-reference/e33e0a714a05d-list-users
     *
     * @example
     * const users = await client.getUsers();
     * const users = await client.getUsers({ planID: 123 });
     * const users = await client.getUsers({ state: 'active' });
     * const users = await client.getUsers({ subscriptionID: 456 });
     *
     * @note
     * If you have a large amount of active users, you will need to create paginated calls to this function.
     */
    getUsers(options) {
        const { page = 1, resultsPerPage = 200, state = null, planID = null, subscriptionID = null, } = options || {};
        const body = {
            page,
            ...(planID && { plan_id: String(planID) }),
            results_per_page: resultsPerPage,
            ...(state && { state }),
            ...(subscriptionID && { subscription_id: subscriptionID }),
        };
        return this._request('/subscription/users', { body });
    }
    /**
     * Change the due date of an upcoming subscription payment.
     *
     * API documentation: https://developer.paddle.com/api-reference/fe93f28aa7f7e-reschedule-payment
     *
     * @example
     * const result = await client.reschedulePayment(123, new Date('2022-12-04'));
     */
    reschedulePayment(paymentID, date) {
        return this._request('/subscription/payments_reschedule', {
            body: {
                payment_id: paymentID,
                date: date.toISOString().substring(0, 10),
            },
        });
    }
    /**
     * Generate a custom pay link.
     *
     * API documentation: https://developer.paddle.com/api-reference/3f031a63f6bae-generate-pay-link
     *
     * @example
     * const custom = await client.generatePayLink({
     *   title: 'my custom checkout',
     *   custom_message: 'some custom message',
     *   prices: [
     *      'USD:19.99',
     *      'EUR:15.99'
     *    ]
     * });
     */
    generatePayLink(body) {
        return this._request('/product/generate_pay_link', {
            body,
            form: false,
            json: true,
        });
    }
    /**
     * Get information about an order after a transaction completes.
     *
     * API documentation: https://developer.paddle.com/api-reference/fea392d1e2f4f-get-order-details
     *
     * @example
     * const result = await client.getOrderDetails('219233-chre53d41f940e0-58aqh94971');
     */
    getOrderDetails(checkoutID) {
        return this._request(`/order?checkout_id=${checkoutID}`, {
            checkoutAPIVersion: 'v1',
        });
    }
    /**
     * Get prices
     *
     * API documentation: https://developer.paddle.com/api-reference/e268a91845971-get-prices
     *
     * @example
     * const result = await client.getPrices([123, 456]);
     * const result = await client.getPrices([123, 456], { coupons: ['EXAMPLE'], customerCountry: 'GB', customerIp: '127.0.0.1' });
     */
    getPrices(productIDs, options) {
        const { coupons, customerCountry, customerIp } = options || {};
        const params = new URLSearchParams({
            product_ids: productIDs.join(','),
            ...(Array.isArray(coupons) && { coupons: coupons.join(',') }),
            ...(customerCountry && { customer_country: customerCountry }),
            ...(customerIp && { customer_ip: customerIp }),
        });
        return this._request(`/prices?${params.toString()}`, {
            checkoutAPIVersion: 'v2',
        });
    }
    /**
     * Get subscription modifiers.
     *
     * API documentation: https://developer.paddle.com/api-reference/f575ab89eb18c-list-modifiers
     *
     * @example
     * const result = await client.getSubscriptionModifiers();
     * const result = await client.getSubscriptionModifiers({ subscriptionID: 123 });
     */
    getSubscriptionModifiers(options) {
        const { subscriptionID, planID } = options || {};
        const body = {
            ...(subscriptionID && { subscription_id: String(subscriptionID) }),
            ...(planID && { plan_id: String(planID) }),
        };
        return this._request('/subscription/modifiers', {
            body,
        });
    }
    /**
     * Create a subscription modifier to dynamically change the subscription payment amount.
     *
     * API documentation: https://developer.paddle.com/api-reference/dc2b0c06f0481-create-modifier
     *
     * @example
     * const result = await client.createSubscriptionModifier(123, 10);
     * const result = await client.createSubscriptionModifier(123, 10, { recurring: false, description: 'description' });
     */
    createSubscriptionModifier(subscriptionID, amount, options) {
        const { description, recurring } = options || {};
        const body = {
            subscription_id: subscriptionID,
            modifier_amount: amount,
            ...(description && { modifier_description: description }),
            ...(typeof recurring === 'boolean' && {
                modifier_recurring: recurring,
            }),
        };
        return this._request('/subscription/modifiers/create', {
            body,
        });
    }
    /**
     * Make an immediate one-off charge on top of an existing user subscription
     *
     * API documentation: https://developer.paddle.com/api-reference/23cf86225523f-create-one-off-charge
     *
     * @example
     * const result = await client.createOneOffCharge(123, 10, 'description');
     */
    createOneOffCharge(subscriptionID, amount, chargeName) {
        const body = {
            amount,
            charge_name: chargeName.substring(0, 50),
        };
        return this._request(`/subscription/${subscriptionID}/charge`, {
            body,
        });
    }
    /**
     * Get the used server URL. Some of the requests go to Checkout server, while most will go to Vendor server.
     */
    serverURL(checkoutAPIVersion) {
        return ((this.options && this.options.server) ||
            (checkoutAPIVersion && this.getCheckoutURL(checkoutAPIVersion)) ||
            (this.options && this.options.sandbox
                ? VENDOR_SANDBOX_URL
                : VENDOR_SERVER_URL));
    }
    getCheckoutURL(checkoutAPIVersion) {
        if (this.options && this.options.sandbox) {
            return checkoutAPIVersion === 'v1'
                ? CHECKOUT_SANDBOX_V1_URL
                : CHECKOUT_SANDBOX_V2_URL;
        }
        return checkoutAPIVersion === 'v1'
            ? CHECKOUT_SERVER_V1_URL
            : CHECKOUT_SERVER_V2_URL;
    }
    /**
     * Execute a HTTP request
     *
     * @private
     * @param {string} url - url for the request
     * @param {object} options
     * @param {object} [options.body] - body parameters / object
     * @param {object} [options.headers] - header parameters
     * @param {boolean} [options.form] - serialize the data object to urlencoded format
     */
    async _request(path, { body: requestBody, headers, form = true, checkoutAPIVersion = undefined, } = {}) {
        const url = this.serverURL(checkoutAPIVersion) + path;
        // Requests to Checkout API are using only GET,
        const method = checkoutAPIVersion ? 'GET' : 'POST';
        const fullRequestBody = {
            vendor_id: this.vendorID,
            vendor_auth_code: this.apiKey,
            ...requestBody,
        };
        const options = {
            headers: {
                'User-Agent': `paddle-sdk/${version_1.VERSION} (https://github.com/avaly/paddle-sdk)`,
                ...(form && { 'Content-Type': 'application/x-www-form-urlencoded' }),
                ...(headers || {}),
            },
            method,
        };
        if (method !== 'GET') {
            options.data = fullRequestBody;
        }
        const { data } = await (0, axios_1.default)(url, options);
        if ('success' in data && typeof data.success === 'boolean') {
            if (data.success) {
                const { response } = data;
                // @ts-expect-error Ignore type error on fallback
                return response || data.success;
            }
            throw new PaddleRequestError(`Request ${url} returned an error! response=${JSON.stringify(data)}`, data.error);
        }
        return data;
    }
    /**
     * @private
     */
    _first(response) {
        if (Array.isArray(response)) {
            return response[0];
        }
        return response;
    }
    /**
     * Get the list of transactions for a resource.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @private
     */
    _getTransactions(type, id, page) {
        return this._request(`/${type}/${id}/transactions`, page ? { body: { page } } : undefined);
    }
}
exports.PaddleSDK = PaddleSDK;
class PaddleRequestError extends Error {
    constructor(message, error) {
        super(message);
        this.name = 'PaddleRequestError';
        this.paddleCode = error.code;
        this.paddleMessage = error.message;
    }
}
exports.PaddleRequestError = PaddleRequestError;
