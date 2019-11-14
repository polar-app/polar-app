import * as React from 'react';
import {Button} from 'reactstrap';
import {AccountProvider} from "../../../../web/js/accounts/AccountProvider";

export class UpgradeAccountButton extends React.PureComponent<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const account = AccountProvider.get()

        if (account && account.plan === 'gold') {
            // already at max account level
            return null;
        }

        return (
            <Button color="light" size="md" className="border border-success">
                Upgrade Account
            </Button>
        );

    }


}

interface IProps {
}

interface IState {

}
