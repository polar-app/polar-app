import React, { Component } from 'react';
import {StripeProvider} from 'react-stripe-elements';
import {Elements} from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';

class App extends Component {

  public render() {

    const support = 'support' + '@'  + 'getpolarized.io';

    return (
      <div className="App">

          <div style={{maxWidth: '550px', margin: 'auto'}} className="card mt-5">

              <StripeProvider apiKey="pk_test_OoNGZN9R7s080NpqfH7yT769">
                  {/*<MyStoreCheckout />*/}

                  <Elements>
                      <InjectedCheckoutForm />
                  </Elements>
              </StripeProvider>

              <div className="text-muted p-2 m-1 border-top">
                  Need support?
                  Feel free to email us at: <a href={"mailto:" + support}>{support}</a>
              </div>

          </div>

      </div>
    );
  }
}

export default App;
