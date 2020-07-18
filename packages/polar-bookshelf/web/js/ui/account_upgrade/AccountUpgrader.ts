import {Accounts} from "../../accounts/Accounts";
import {MachineDatastores} from "../../telemetry/MachineDatastores";
import {AccountUpgrades} from "../../accounts/AccountUpgrades";
import {UpgradeRequiredMessageBoxes} from "./UpgradeRequiredMessageBoxes";
import {Logger} from "polar-shared/src/logger/Logger";
import {Analytics} from "../../analytics/Analytics";

const log = Logger.create();

/**
 * Looks at the amount of storage used, etc to verify that the user doesn't need to upgrade.
 */
export class AccountUpgrader {

    public async upgradeRequired() {

        const account = await Accounts.get();
        const machineDatastore = await MachineDatastores.get();

        if (! account) {
            return;
        }

        if (! machineDatastore) {
            return;
        }

        const planRequiredForUpgrade = AccountUpgrades.upgradeRequired(account.plan, machineDatastore);

        const result = planRequiredForUpgrade && account.plan !== planRequiredForUpgrade;

        if (result) {
            log.warn(`Current account needs to be upgrade from ${account.plan} to ${planRequiredForUpgrade}`);
        }

        return result;

    }

    public startUpgrade() {

        Analytics.event({category: 'upgrades', action: 'required-upgrade-triggered'});

        UpgradeRequiredMessageBoxes.create();

    }

}
