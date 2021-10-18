https://stripe.com/docs/payments/checkout/client-subscription

We have to call get on a StripeCreateSession function on the server and pass ?plan=plus&interval=year

This will then create a stripe session and we send the ID back to the client.

# TODO

- enabling the test keys

localStorage.setItem("stripe_api_key", "...");

- FIXME: how do the change plan functions know it's working in test mode?

- the client would need to set it... &mode=test 