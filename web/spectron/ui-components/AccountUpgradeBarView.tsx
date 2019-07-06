import * as React from 'react';
import {Logger} from "../../js/logger/Logger";
import {Button} from "reactstrap";
import {AccountUpgrades, AccountUsage} from "../../js/accounts/AccountUpgrades";
import {AccountPlan} from "../../js/accounts/Account";

const log = Logger.create();

interface UpgradeRequiredProps {
    readonly planRequired?: AccountPlan;
}
const UpgradeRequired = (props: UpgradeRequiredProps) => {

    return <div className="p-1 rounded"
                style={{
                    backgroundColor: '#ffcccc',
                    fontWeight: 'bold'
                }}>

        <Button color="danger"
                size="sm"
                onClick={() => document.location.hash = 'plans'}>

            <i className="fas fa-certificate"/>
            &nbsp;
            Upgrade Required

        </Button>

        <span className="ml-1">
            Your account has exceeded limits for your current plan.  Please upgrade.
        </span>

    </div>;

};

const NullComponent = () => {
    return <div/>;
};

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class AccountUpgradeBarView extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {plan, accountUsage} = this.props;

        if (! plan || ! accountUsage) {
            return <NullComponent/>;
        }

        const planRequired = AccountUpgrades.upgradeRequired(plan, accountUsage);

        if (! planRequired) {
            return <NullComponent/>;
        }

        return <UpgradeRequired planRequired={planRequired}/>;

    }

}

interface IProps {
    readonly plan?: AccountPlan;
    readonly accountUsage?: AccountUsage;
}

interface IState {
}
