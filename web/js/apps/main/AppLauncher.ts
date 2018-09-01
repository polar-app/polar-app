import {BrowserWindow} from "electron";
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {AppPaths} from '../../electron/webresource/AppPaths';

export class AppLauncher {

    public static async launchRepositoryApp(): Promise<BrowserWindow> {

        const url = AppPaths.resource('./apps/repository/index.html');

        return MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);
    }

}
