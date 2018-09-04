import {BrowserWindow} from "electron";
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {BrowserWindowRegistry} from '../../electron/framework/BrowserWindowRegistry';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

export class AppLauncher {

    public static async launchRepositoryApp(): Promise<BrowserWindow> {

        const url = AppPaths.resource('./apps/repository/index.html');

        let existing = BrowserWindowRegistry.tagged('name', 'repository');

        if(existing.length === 1) {

            log.info("Found existing repository UI. Focusing.");

            let id = existing[0];

            let browserWindow = BrowserWindow.fromId(id);
            browserWindow.focus();
            return browserWindow;
        }

        let result = await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);

        BrowserWindowRegistry.tag(result.id, {name: 'repository'});

        return result;

    }

}
