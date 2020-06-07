import * as React from 'react';
import {AccountProvider} from "../../../../web/js/accounts/AccountProvider";
import {Link} from "react-router-dom";
import {Analytics} from "../../../../web/js/analytics/Analytics";
import Button from "@material-ui/core/Button";

export class UpgradeAccountButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.onUpgrade = this.onUpgrade.bind(this);
    }

    public render() {

        const account = AccountProvider.get()

        if (account && account.plan === 'gold') {
            // already at max account level
            return null;
        }

        return (
            <Link to={{pathname: '/plans'}}>
                <Button variant="contained"
                        onClick={() => this.onUpgrade()}
                        className="border border-success">

                    Upgrade Account

                </Button>
            </Link>
        );

    }

    private onUpgrade() {
        Analytics.event({category: 'premium', action: 'upgrade-account-button'});
    }

}

interface IProps {
}

interface IState {

}
