import {Accounts} from "../../accounts/Accounts";
import {MachineDatastores} from "../../telemetry/MachineDatastores";
import {AccountUpgrades} from "../../accounts/AccountUpgrades";
import {UpgradeRequiredMessageBoxes} from "./UpgradeRequiredMessageBoxes";

export class AccountUpgrader {

    public async upgradeRequired() {

        return true;

        // const account = await Accounts.get();
        // const machineDatastore = await MachineDatastores.get();
        //
        // if (! account) {
        //     return;
        // }
        //
        // if (! machineDatastore) {
        //     return;
        // }
        //
        // const planRequiredForUpgrade = AccountUpgrades.upgradeRequired(account.plan, machineDatastore);
        //
        // return account.plan !== planRequiredForUpgrade;

    }

    public startUpgrade() {

        UpgradeRequiredMessageBoxes.create();

    }

}
