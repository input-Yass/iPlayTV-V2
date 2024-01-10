Paddle.Environment.set("sandbox"); // replace with "production" before going live
  Paddle.Setup({ 
    token: 'test_cb109ef2e6a80f65476d44f227a' // replace with your client-side token
  });

  function buyProduct(productId) {
    Paddle.Checkout.open({
        product: productId
    })
  }