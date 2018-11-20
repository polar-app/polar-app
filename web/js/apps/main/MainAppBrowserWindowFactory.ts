import {BrowserWindow, nativeImage, shell} from "electron";
import {Logger} from '../../logger/Logger';
import {AppPaths} from '../../electron/webresource/AppPaths';

const log = Logger.create();

const WIDTH = 800 * 1.2;
const HEIGHT = 1100 * 1.2;

const DEFAULT_URL = AppPaths.resourceURLFromRelativeURL('./apps/home/default.html');

// TODO: files in the root are always kept in the package we can just load
// this as a native_image directly.
export const APP_ICON = AppPaths.resourceURLFromRelativeURL('./icon.png');

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
        nodeIntegration: true,

        // NOTE: these must be disabled because they break pdf.js.  It must be
        // some change to require() from their workers.  So maybe I just can't
        // use workers for now.
        // nodeIntegrationInWorker: true,
        //
        // sandbox: false,

        defaultEncoding: 'UTF-8',

        // We are disabling web security now as a work around for CORS issues
        // when loading fonts.  Once we resolve this we can enable webSecurity
        // again.
        webSecurity: false,

        webaudio: true,

        /**
         * Use a persistent cookie session between restarts.  This is used so
         * that we keep user cookies including Google Analytics cookies.
         */
        //
        partition: "persist:polar"

    }

};

export class MainAppBrowserWindowFactory {

    public static createWindow(browserWindowOptions: Electron.BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS,
                               url = DEFAULT_URL): Promise<BrowserWindow> {

        log.info("Creating window for URL: ", url);

        // TODO: offset the window vs the currently focused window

        browserWindowOptions = Object.assign({}, browserWindowOptions);

        const position = this.computeXY();

        if (position) {
            // add some offset to this window so that the previous window and the
            // current one don't line up perfectly or else it seems like nothing
            // happened or that the new window replaced the old one.
            browserWindowOptions.x = position.x;
            browserWindowOptions.y = position.y;
        }

        // Create the browser window.
        const browserWindow = new BrowserWindow(browserWindowOptions);

        browserWindow.on('close', function(e) {
            e.preventDefault();

            if (browserWindow.webContents) {

                browserWindow.webContents.clearHistory();
                browserWindow.webContents.session.clearCache(() => {
                    browserWindow.destroy();
                });

            }

        });

        browserWindow.webContents.on('new-window', (e, url) => {
            e.preventDefault();
            shell.openExternal(url);
        });

        browserWindow.webContents.on('will-navigate', (e, url) => {
            log.info("Attempt to navigate to new URL: ", url);
            // required to force the URLs clicked to open in a new browser.  The
            // user probably / certainly wants to use their main browser.
            e.preventDefault();
            shell.openExternal(url);
        });

        log.info("Loading URL: " + url);
        browserWindow.loadURL(url);

        return new Promise<BrowserWindow>(resolve => {

            browserWindow.once('ready-to-show', () => {

                // As of Electron 3.0 beta8 there appears to be a bug where
                // it persists teh zoom factor between restarts and restores
                // the zoom factor for the user but this can break / confuse
                // PHZ loading so we always want them to start at 1.0
                browserWindow.webContents.setZoomFactor(1.0);

                browserWindow.show();

                resolve(browserWindow);

            });

        });

    }

    private static computeXY(): Position | undefined {

        const offset = 35;

        const focusedWindow = BrowserWindow.getFocusedWindow();

        if (focusedWindow) {
            const position = focusedWindow.getPosition();
            let x = position[0];
            let y = position[1];

            x += offset;
            y += offset;

            return {x, y};

        }

        return undefined;

    }

}

interface Position {
    x: number;
    y: number;
}
