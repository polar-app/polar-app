// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {

    private name: string | null = "";
    private email: string | null = "";

    constructor(props: any, context: any) {
        super(props, context);

        const params = (new URL(document.location.href)).searchParams;
        this.name = params.get("name");
        this.email = params.get("email");

    }

    public render() {
        return (
            <div style={{display: 'block'}}>
                {/*Card details*/}

                <div className="form-group">
                    <input id="customer-name"
                           type="name"
                           autoFocus={true}
                           defaultValue={this.name || ""}
                           className="form-control"
                           placeholder="Full name"/>
                </div>

                {/*<div className="form-group">*/}
                    {/*<input type="address_line1"*/}
                           {/*className="form-control"*/}
                           {/*placeholder="Address"/>*/}
                {/*</div>*/}

                {/*<div className="form-group">*/}
                    {/*<input type="address_line2"*/}
                           {/*className="form-control"*/}
                           {/*placeholder="Address"/>*/}
                {/*</div>*/}

                {/*<div className="form-group">*/}
                    {/*<input type="name"*/}
                           {/*className="form-control"*/}
                           {/*placeholder="Full name"/>*/}
                {/*</div>*/}

                <input type="hidden" id="customer-email" name="email" value={this.email || ""}/>

                <div>
                    <CardElement style={{base: {fontSize: '18px'}}} />
                </div>

            </div>

        );
    }
}

export default CardSection;
