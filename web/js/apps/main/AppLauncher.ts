import {BrowserWindow} from "electron";
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {ResourcePaths} from '../../electron/webresource/ResourcePaths';
import {SingletonBrowserWindow} from '../../electron/framework/SingletonBrowserWindow';
import {Logger} from "../../logger/Logger";

const log =  Logger.create();

export class AppLauncher {

    public static async launchRepositoryApp(): Promise<BrowserWindow> {

        const browserWindowTag = {name: 'app', value: 'repository'};

        return await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {
            const url = ResourcePaths.resourceURLFromRelativeURL('/apps/repository/index.html', false);
            log.info("Loading app from URL: " + url);

            const browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

            // use a 'polar-app' session so we don't use the default session which
            // is intercepted.
            browserWindowOptions.webPreferences!.partition = 'persist:polar-app';

            return await MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);
        });

    }

}
