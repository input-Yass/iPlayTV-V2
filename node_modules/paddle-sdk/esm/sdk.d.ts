import { CreateOneOffChargeResponse, CreateSubscriptionModifierResponse, GeneratePaylinkBody, GeneratePaylinkResponse, GetPricesResponse, GetProductCouponsResponse, GetProductsResponse, GetSubscriptionModifiersResponse, GetSubscriptionPaymentsResponse, GetSubscriptionPlansResponse, GetSubscriptionUsersBody, GetSubscriptionUsersResponse, GetTransactionsResponse, GetWebhookHistoryResponse, PaddleResponseError, UpdateSubscriptionUserResponse } from './types';
type CheckoutAPIVersion = 'v1' | 'v2';
export interface Options {
    /** Whether to use the sandbox server URL */
    sandbox?: boolean;
    /** The server URL prefix for all requests */
    server?: string;
}
export declare class PaddleSDK {
    /** The API key for a Paddle account */
    apiKey: string;
    /**	The public key for a Paddle account used to verify webhooks, only required for {@link verifyWebhookData} */
    publicKey: string;
    options?: Options;
    /** The vendor ID for a Paddle account */
    vendorID: string;
    /**
     * @param vendorID The vendor ID for a Paddle account
     * @param apiKey The API key for a Paddle account
     * @param publicKey The public key for a Paddle account used to verify webhooks, only required for {@link verifyWebhookData}
     *
     * @example
     * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key');
     * const client = new PaddleSDK('your-vendor-id', 'your-unique-api-key', 'your-public-key');
     */
    constructor(vendorID: string, apiKey: string, publicKey?: string, options?: Options);
    /**
     * Get the current list of products.
     *
     * API documentation: https://developer.paddle.com/api-reference/0f31bd7cbce47-list-products
     *
s	 * @example
     * const products = await client.getProducts();
     */
    getProducts(): Promise<GetProductsResponse>;
    /**
     * Get the current list of coupons for a product.
     *
     * API documentation: https://developer.paddle.com/api-reference/6a59b795bd653-list-coupons
     *
     * @example
     * const coupons = await client.getProductCoupons(123);
     */
    getProductCoupons(productID: number): Promise<GetProductCouponsResponse>;
    /**
     * Get a list of all the available subscription plans.
     *
     * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
     *
     * @example
     * const plans = await client.getSubscriptionPlans();
     */
    getSubscriptionPlans(): Promise<GetSubscriptionPlansResponse>;
    /**
     * Get the plan based on its ID.
     *
     * API documentation: https://developer.paddle.com/api-reference/a835554495295-list-plans
     *
     * @example
     * const plan = await client.getSubscriptionPlan(123);
     */
    getSubscriptionPlan(planID: number): Promise<import("./types").SubscriptionPlan>;
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
    getSubscriptionPayments(options?: number | {
        planID?: number;
        subscriptionID?: number;
        isPaid?: boolean;
        from?: Date;
        to?: Date;
        isOneOffCharge?: boolean;
    }): Promise<GetSubscriptionPaymentsResponse>;
    /**
     * Get the list of latest webhooks history.
     *
     * API documentation: https://developer.paddle.com/api-reference/7695d655c158b-get-webhook-history
     *
     * @example
     * const webhooksHistory = await client.getWebhooksHistory();
     */
    getWebhooksHistory(): Promise<GetWebhookHistoryResponse>;
    /**
     * Get the list of transactions for a user.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const userTransactions = await client.getUserTransactions(123);
     * const userTransactionsNext = await client.getUserTransactions(123, 2);
     */
    getUserTransactions(userID: number, page?: number): Promise<GetTransactionsResponse>;
    /**
     * Get the list of transactions for a subscription.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
=	 * @example
     * const subscriptionTransactions = await client.getSubscriptionTransactions(123);
     * const subscriptionTransactionsNext = await client.getSubscriptionTransactions(123, 2);
     */
    getSubscriptionTransactions(subscriptionID: number, page?: number): Promise<GetTransactionsResponse>;
    /**
     * Get the list of transactions for an order.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const orderTransactions = await client.getOrderTransactions(123);
     * const orderTransactionsNext = await client.getOrderTransactions(123, 2);
     */
    getOrderTransactions(orderID: number, page?: number): Promise<GetTransactionsResponse>;
    /**
     * Get the list of transactions for a checkout.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const checkoutTransactions = await client.getCheckoutTransactions('123');
     * const checkoutTransactionsNext = await client.getCheckoutTransactions('123', 2);
     */
    getCheckoutTransactions(checkoutID: string, page?: number): Promise<GetTransactionsResponse>;
    /**
     * Get the list of transactions for a product.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @example
     * const productTransactions = await client.getProductTransactions(123);
     * const productTransactionsNext = await client.getProductTransactions(123, 2);
     */
    getProductTransactions(productID: number, page?: number): Promise<GetTransactionsResponse>;
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
    verifyWebhookData(postData: {
        p_signature: string;
    } & Record<string, unknown>): boolean;
    /**
     * Update subscription details, quantity, price and or currency.
     *
     * API documentation: https://developer.paddle.com/api-reference/e3872343dfbba-update-user
     *
     * @example
     * const result = await client.updateSubscriptionPlan(123, { quantity: 2 });
     */
    updateSubscription(subscriptionID: number, postData: {
        billImmediately?: boolean;
        currency?: string;
        keepModifiers?: boolean;
        passthrough?: string;
        pause?: boolean;
        planID?: number;
        prorate?: boolean;
        price?: number;
        quantity?: number;
    }): Promise<UpdateSubscriptionUserResponse>;
    /**
     * Cancels an active subscription.
     *
     * API documentation: https://developer.paddle.com/api-reference/9b808453c3216-cancel-user
     *
     * @example
     * const result = await client.cancelSubscription(123);
     */
    cancelSubscription(subscriptionID: number): Promise<boolean>;
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
    getUsers(options?: {
        page?: number;
        resultsPerPage?: number;
        planID?: string | number;
        state?: GetSubscriptionUsersBody['state'];
        subscriptionID?: number;
    }): Promise<GetSubscriptionUsersResponse>;
    /**
     * Change the due date of an upcoming subscription payment.
     *
     * API documentation: https://developer.paddle.com/api-reference/fe93f28aa7f7e-reschedule-payment
     *
     * @example
     * const result = await client.reschedulePayment(123, new Date('2022-12-04'));
     */
    reschedulePayment(paymentID: number, date: Date): Promise<boolean>;
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
    generatePayLink(body: GeneratePaylinkBody): Promise<GeneratePaylinkResponse>;
    /**
     * Get information about an order after a transaction completes.
     *
     * API documentation: https://developer.paddle.com/api-reference/fea392d1e2f4f-get-order-details
     *
     * @example
     * const result = await client.getOrderDetails('219233-chre53d41f940e0-58aqh94971');
     */
    getOrderDetails(checkoutID: string): Promise<unknown>;
    /**
     * Get prices
     *
     * API documentation: https://developer.paddle.com/api-reference/e268a91845971-get-prices
     *
     * @example
     * const result = await client.getPrices([123, 456]);
     * const result = await client.getPrices([123, 456], { coupons: ['EXAMPLE'], customerCountry: 'GB', customerIp: '127.0.0.1' });
     */
    getPrices(productIDs: number[], options?: {
        coupons?: string[];
        customerCountry?: string;
        customerIp?: string;
    }): Promise<GetPricesResponse>;
    /**
     * Get subscription modifiers.
     *
     * API documentation: https://developer.paddle.com/api-reference/f575ab89eb18c-list-modifiers
     *
     * @example
     * const result = await client.getSubscriptionModifiers();
     * const result = await client.getSubscriptionModifiers({ subscriptionID: 123 });
     */
    getSubscriptionModifiers(options?: {
        subscriptionID?: number;
        planID?: number;
    }): Promise<GetSubscriptionModifiersResponse>;
    /**
     * Create a subscription modifier to dynamically change the subscription payment amount.
     *
     * API documentation: https://developer.paddle.com/api-reference/dc2b0c06f0481-create-modifier
     *
     * @example
     * const result = await client.createSubscriptionModifier(123, 10);
     * const result = await client.createSubscriptionModifier(123, 10, { recurring: false, description: 'description' });
     */
    createSubscriptionModifier(subscriptionID: number, amount: number, options?: {
        description?: string;
        recurring?: boolean;
    }): Promise<CreateSubscriptionModifierResponse>;
    /**
     * Make an immediate one-off charge on top of an existing user subscription
     *
     * API documentation: https://developer.paddle.com/api-reference/23cf86225523f-create-one-off-charge
     *
     * @example
     * const result = await client.createOneOffCharge(123, 10, 'description');
     */
    createOneOffCharge(subscriptionID: number, amount: number, chargeName: string): Promise<CreateOneOffChargeResponse>;
    /**
     * Get the used server URL. Some of the requests go to Checkout server, while most will go to Vendor server.
     */
    serverURL(checkoutAPIVersion?: CheckoutAPIVersion): string;
    private getCheckoutURL;
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
    private _request;
    /**
     * @private
     */
    private _first;
    /**
     * Get the list of transactions for a resource.
     *
     * API documentation: https://developer.paddle.com/api-reference/89c1805d821c2-list-transactions
     *
     * @private
     */
    private _getTransactions;
}
export declare class PaddleRequestError extends Error {
    paddleCode: number;
    paddleMessage: string;
    constructor(message: string, error: PaddleResponseError);
}
export {};
