// CheckoutForm.js
import React from 'react';
import {injectStripe} from 'react-stripe-elements';

// import AddressSection from './AddressSection';
import CardSection from './CardSection';

const CHARGE_URL = "https://localhost:8181/charge";

class CheckoutForm extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    public render() {
        return (
            <div className="card-body">
                <form onSubmit={(ev) => this.onSubmit(ev)}>

                    {/*<AddressSection />*/}

                    <CardSection />

                    <div>
                        <button type="submit"
                                className="btn btn-primary mt-1">Subscribe for $7.99</button>
                    </div>

                </form>
            </div>
        );
    }

    public async onSubmit(ev: any) {

        ev.preventDefault();

        const name = this.formInputText('customer-name');
        const email = this.formInputText('customer-email');

        const {token} = await this.props.stripe.createToken({name, email});

        const response = await fetch(CHARGE_URL, {
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: token.id
        });

        // FIXME: what about any errors here???

        if (response.ok) {

            // FIXME: change state here to update the UI and I can do this via
            // state...

            console.log("Purchase Complete!");

        }

    }

    private formInputText(id: string)  {
        const element = document.getElementById(id) as HTMLInputElement;
        return element.value || null;
    }

}

interface IProps {
    // TODO: I don't think there are TS bindings?
    readonly stripe?: any;
}

interface IState {
    // stripe: stripe;
}


export default injectStripe(CheckoutForm);

