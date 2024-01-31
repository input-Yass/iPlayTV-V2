window.onload = () => {
  if (!sessionStorage.user) {
    location.replace('/login')
  }
}


Paddle.Environment.set("sandbox");
Paddle.Setup({ 
  token: 'test_cb109ef2e6a80f65476d44f227a', 
  pwAuth: '2930df3a8d5ebebdf1613b5094a2522c9de44e553ba4bd6ece', 
  pwCustomer: { },
  eventCallback: function(data) {
    if (data.name == "checkout.completed") {
      // location.replace('/404')
    }
  }
});

function openCheckout() {
  Paddle.Checkout.open({
    settings: {
      displayMode: "overlay",
      theme: "light",
      locale: "en",
      allowLogout: false
    }
  });
}