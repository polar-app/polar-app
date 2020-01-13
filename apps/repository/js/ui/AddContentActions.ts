import {remote} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Analytics} from "../../../../web/js/analytics/Analytics";

const log = Logger.create();

export class AddContentActions {

    public static cmdImportFromDisk() {

        Analytics.event({category: 'add-content', action: 'import-from-disk'});

        this.getController().cmdImport()
            .catch((err: Error) => log.error("Could not import from disk: ", err));

    }

    public static cmdCaptureWebPage() {

        Analytics.event({category: 'add-content', action: 'capture-web-page'});

        this.getController().cmdCaptureWebPageWithBrowser()
            .catch((err: Error) => log.error("Could not capture page: ", err));

    }

    private static getController(): IMainAppController {
        return remote.getGlobal('mainAppController');
    }

}

interface IMainAppController {

    cmdImport(): Promise<void>;

    cmdCaptureWebPageWithBrowser(): Promise<void>;
}
