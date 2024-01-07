Paddle.Environment.set("sandbox"); // replace with "production" before going live
  Paddle.Setup({ 
    token: '7d279f61a3499fed520f7cd8c08' // replace with your client-side token
  });

  $(function() {
    var urlParams = new URLSearchParams(window.location.search);

    Paddle.Checkout.open({
          transactionId: urlParams.get('_ptxn'),
          settings: {
            theme: "light",
            locale: "en",
            successUrl: urlParams.get('_px_success_url')
        }
    });
  });