import {BrowserWindow} from "electron";
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {SingletonBrowserWindow} from '../../electron/framework/SingletonBrowserWindow';

export class AppLauncher {

    public static async launchRepositoryApp(): Promise<BrowserWindow> {

        let browserWindowTag = {name: 'app', value: 'repository'};

        return await SingletonBrowserWindow.getInstance(browserWindowTag,async () => {

            const url = AppPaths.resource('./apps/repository/index.html');

            return await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);

        });

    }

}
