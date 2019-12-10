import * as React from 'react';
import {Button} from 'reactstrap';
import {AccountProvider} from "../../../../web/js/accounts/AccountProvider";
import {RendererAnalytics} from "../../../../web/js/ga/RendererAnalytics";

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
            <Button color="light"
                    size="md"
                    onClick={() => this.onUpgrade()}
                    className="border border-success">

                {/*<i className="fas fa-certificate"/>*/}

                Upgrade Account

            </Button>
        );

    }

    private onUpgrade() {
        RendererAnalytics.event({category: 'premium', action: 'upgrade-account-button'});
        document.location.hash = "plans";
    }

}

interface IProps {
}

interface IState {

}
