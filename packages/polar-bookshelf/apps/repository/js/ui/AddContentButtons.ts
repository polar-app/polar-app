import { Logger } from "polar-shared/src/logger/Logger";
import {AccountUpgrader} from "../../../../web/js/ui/account_upgrade/AccountUpgrader";

const log = Logger.create();

export class AddContentButtons {

    public static triggerFileUpload() {

        const fileUpload = document.getElementById('file-upload');

        if (fileUpload) {
            fileUpload.focus();
            fileUpload.click();
        } else {
            log.warn("No file upload button");
        }

    }

    public static doAccountVerifiedAction(delegate: () => void) {

        const handler = async () => {

            const accountUpgrader = new AccountUpgrader();

            if (await accountUpgrader.upgradeRequired()) {
                log.warn("Account upgrade required");
                accountUpgrader.startUpgrade();
                return;
            }

            delegate();

        };

        handler()
            .catch(err => log.error("Unable to add to repository: ", err));

    }

}
