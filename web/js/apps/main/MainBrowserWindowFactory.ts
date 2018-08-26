import {BrowserWindow, nativeImage, shell} from "electron";
import {Logger} from '../../logger/Logger';
import {AppPaths} from '../../electron/webresource/AppPaths';

const log = Logger.create();

const fspath = require('path');

const WIDTH = 800 * 1.2;
const HEIGHT = 1100 * 1.2;

const DEFAULT_URL = AppPaths.resource('./apps/home/default.html');

export const APP_ICON = AppPaths.resource('./icon.png');

export const BROWSER_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = {
    backgroundColor: '#FFF',
    minWidth: WIDTH * 0.4,
    minHeight: HEIGHT * 0.4,
    width: WIDTH,
    height: HEIGHT,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions

    // TODO: the AppIcon CAN be a file URL
    icon: APP_ICON,
    webPreferences: {
        // TODO:
        // https://github.com/electron/electron/pull/794
        //
        // reconsider using nodeIntegration here as this might be a security
        // issue
        nodeIntegration: true,

        nodeIntegrationInWorker: true,

        sandbox: false,

        defaultEncoding: 'UTF-8',

        // We are disabling web security now as a work around for CORS issues
        // when loading fonts.  Once we resolve this we can enable webSecurity
        // again.
        webSecurity: false,

        webaudio: false,

        /**
         * Use a persistent cookie session between restarts.  This is used so
         * that we keep user cookies including Google Analytics cookies.
         */
        //partition: "persist:polar"

    }
};

export class MainBrowserWindowFactory {

    public static createWindow(browserWindowOptions: Electron.BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS, url=DEFAULT_URL): Promise<BrowserWindow> {

        log.info("Creating window for URL: ", url);

        // Create the browser window.
        let newWindow = new BrowserWindow(browserWindowOptions);

        newWindow.on('close', function(e) {
            e.preventDefault();
            newWindow.webContents.clearHistory();
            newWindow.webContents.session.clearCache(function() {
                newWindow.destroy();
            });
        });

        newWindow.webContents.on('new-window', (e, url) => {
            e.preventDefault();
            shell.openExternal(url);
        });

        newWindow.webContents.on('will-navigate', (e, url) => {
            log.info("Attempt to navigate to new URL: ", url);
            // required to force the URLs clicked to open in a new browser.  The
            // user probably / certainly wants to use their main browser.
            e.preventDefault();
            shell.openExternal(url);
        });

        log.info("Loading URL: ", url);
        newWindow.loadURL(url);

        return new Promise<BrowserWindow>(resolve => {

            newWindow.once('ready-to-show', () => {

                newWindow.show();

                resolve(newWindow);

            });

        })

    }

}
