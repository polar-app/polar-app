import * as React from 'react';
import {MachineDatastore, MachineDatastores} from "../../js/telemetry/MachineDatastores";
import {Accounts} from "../../js/accounts/Accounts";
import {Account} from "../../js/accounts/Account";
import {Logger} from "../../js/logger/Logger";
import {Firebase} from "../../js/firebase/Firebase";
import {AccountUpgradeBarView} from "./AccountUpgradeBarView";

const log = Logger.create();

/**
 * Listen to the machine datastore for this user and if their account isn't in
 * line with the machine data store then we have to force them to upgrade.
 */
export class AccountUpgradeBar extends React.Component<IProps, IState> {

    constructor(props: IProps, context: any) {
        super(props, context);

        this.state = {
        };

        const handler = async () => {

            const user = await Firebase.currentUser();

            if (! user) {
                // the user is not using Firebase.
                return;
            }

            await Accounts.onSnapshot(account => {
                this.setState({...this.state, account});
            });

            await MachineDatastores.onSnapshot(machineDatastore => {
                this.setState({...this.state, machineDatastore});
            });

        };

        handler().catch(err => log.error("Failed to handle upgrades: ", err));


    }

    public render() {

        const plan = this.state.account ? this.state.account.plan : undefined;

        return (
            <AccountUpgradeBarView plan={plan} accountUsage={this.state.machineDatastore}/>
        );

    }

}

interface IProps {
}

interface IState {
    readonly account?: Account;
    readonly machineDatastore?: MachineDatastore;
}


