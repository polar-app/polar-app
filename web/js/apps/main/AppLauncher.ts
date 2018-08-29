import {BrowserWindow} from "electron";
import {BROWSER_WINDOW_OPTIONS, MainBrowserWindowFactory} from './MainBrowserWindowFactory';
import {AppPaths} from '../../electron/webresource/AppPaths';

export class AppLauncher {

    public static async launchRepositoryApp(): Promise<BrowserWindow> {

        const url = AppPaths.resource('./apps/repository/index.html');

        return MainBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);
    }

}
