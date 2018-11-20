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

            // FIXME: once we switch to loading this via a real HTTP URL it fails and I'm not sure why...

            const url = ResourcePaths.resourceURLFromRelativeURL('/apps/repository/index.html', false);
            log.info("Loading app from URL: " + url);
            return await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);

        });

    }

}
