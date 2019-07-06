import * as React from 'react';
import {MachineDatastore} from "../../js/telemetry/MachineDatastores";
import {Account} from "../../js/accounts/Accounts";
import {Logger} from "../../js/logger/Logger";
import {Button} from "reactstrap";
import {NULL_FUNCTION} from "../../js/util/Functions";

const log = Logger.create();


const UpgradeRequired = () => {

    return <Button color="danger"
                   size="sm"
                   onClick={NULL_FUNCTION}>

        <i className="fas fa-certificate"/>

        Upgrade Required

    </Button>;

};

const NullComponent = () => {
    return <div/>;
};

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class AccountUpgradeButtonView extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);
    }

    public render() {

        const {account, machineDatastore} = this.props;

        if (! account || ! machineDatastore) {
            return <NullComponent/>;
        }

        return <UpgradeRequired/>;

    }

}

interface IProps {
    readonly account?: Account;
    readonly machineDatastore?: MachineDatastore;
}

interface IState {
}


