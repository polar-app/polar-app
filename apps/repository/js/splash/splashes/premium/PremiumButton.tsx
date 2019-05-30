import * as React from 'react';
import Button from 'reactstrap/lib/Button';
import {Logger} from '../../../../../../web/js/logger/Logger';
import {Nav} from '../../../../../../web/js/ui/util/Nav';
import {Toaster} from '../../../../../../web/js/ui/toaster/Toaster';

const log = Logger.create();

export class PremiumButton extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

    }

    public render() {

        const {to, from} = this.props;

        // true if we're BUYING a new plan...
        const buy = from === 'free';

        const text = buy ? "Buy" : "Upgrade";

        const buyHandler = () => {
            // if we're buying a NEW product go ahead and redirect us to
            // stripe and use their BUY package.  This is better than embedding
            // the stripe SDK and also stripe ALSO needs to run over HTTPS
            Nav.openLinkWithNewTab(`https://getpolarized.io/pay.html?email=burton@inputneuron.io&plan=${to}`);
        };

        const upgradeHandler = () => {
            Toaster.info("Not implemented yet");
        };

        const handler = buy ? buyHandler : upgradeHandler;

        return (

            <Button color="secondary"
                    onClick={() => handler()}>

                {text}

            </Button>

        );
    }

}

export interface IProps {
    readonly from: Plan;
    readonly to: Plan;
}

export interface IState {

}

export type Plan = 'free' | 'bronze' | 'silver' | 'gold';
