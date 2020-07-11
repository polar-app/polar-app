import {BrowserWindow, screen, shell} from "electron";
import {Logger} from 'polar-shared/src/logger/Logger';
import {ResourcePaths} from '../../electron/webresource/ResourcePaths';
import {ElectronUserAgents} from "../electron_browser/ElectronUserAgents";
import {ExternalNavigationBlock} from "../../electron/navigation/ExternalNavigationBlock";

const log = Logger.create();

const WIDTH = 900 * 1.2; // 1300 is like 80% of users
const HEIGHT = 1100 * 1.2;
const SIDEBAR_BUFFER = 100;

const DEFAULT_URL = ResourcePaths.resourceURLFromRelativeURL('./apps/repository/index.html');

export const MAIN_SESSION_PARTITION_NAME = 'persist:polar-app';

// TODO: files in the root are always kept in the package we can just load
// this as a native_image directly.
export const APP_ICON = ResourcePaths.resourceURLFromRelativeURL('./icon.png');

export const BROWSER_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = Object.freeze({
    backgroundColor: '#FFF',
    width: WIDTH + SIDEBAR_BUFFER,
    height: HEIGHT,
    show: false,
    // https://electronjs.org/docs/api/browser-window#new-browserwindowoptions

    // TODO: the AppIcon CAN be a file URL
    icon: APP_ICON,
    // frame: false,
    // titleBarStyle: 'hiddenInset',
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
        // again.  We can completely remove this once we migrate to a complete
        // solution for PHZ files being stored in the browser.
        webSecurity: false,

        webaudio: true,

        /**
         * Use a persistent cookie session between restarts.  This is used so
         * that we keep user cookies including Google Analytics cookies.
         */
        //
        partition: MAIN_SESSION_PARTITION_NAME,

        // enable/disable webview/iframe support.
        // webviewTag: true,
        // nodeIntegrationInSubFrames: true


    }

});

/**
 * @Deprecated now using this code in polar-desktop-app
 */
export class MainAppBrowserWindowFactory {

    public static createWindow(browserWindowOptions: Electron.BrowserWindowConstructorOptions = BROWSER_WINDOW_OPTIONS,
                               url = DEFAULT_URL): Promise<BrowserWindow> {

        // ElectronUserAgents.registerUserAgentHandler(MAIN_SESSION_PARTITION_NAME);

        browserWindowOptions = Object.assign({}, browserWindowOptions);

        const position = this.computeXY();

        if (position) {
            // add some offset to this window so that the previous window and
            // the current one don't line up perfectly or else it seems like
            // nothing happened or that the new window replaced the old one.
            browserWindowOptions.x = position.x;
            browserWindowOptions.y = position.y;
        }

        const display = screen.getPrimaryDisplay();

        // make sure minHeight, maxHeight, width, and height are NOT larger
        // than the current screen dimensions.

        interface DimensionMapping {
            readonly original: 'minWidth' | 'minHeight' | 'width' | 'height';
            readonly dimension: 'width' | 'height';
            readonly defaultValue?: number;
        }

        const dimensionMappings: DimensionMapping[] = [

            {original: 'minHeight', dimension: 'height', defaultValue: 800},
            {original: 'minWidth', dimension: 'width', defaultValue: 600},

            {original: 'height', dimension: 'height'},
            {original: 'width', dimension: 'width'}

        ];

        for (const dimensionMapping of dimensionMappings) {

            const current = browserWindowOptions[dimensionMapping.original]! || dimensionMapping.defaultValue!;
            const max = display.size[dimensionMapping.dimension];

            browserWindowOptions[dimensionMapping.original]
                = Math.min(current, max);

        }

        // log.notice("Creating browser window with options: ", browserWindowOptions);

        // Create the browser window.
        const browserWindow = new BrowserWindow(browserWindowOptions);

        browserWindow.webContents.on('new-window', (e, newURL) => {

            if (ExternalNavigationBlock.get()) {

                e.preventDefault();
                shell.openExternal(newURL)
                    .catch(err => log.error("Could not open external URL", err, newURL));

            } else {
                log.notice("Allowing external navigation to new window URL: " + newURL);
            }

        });

        browserWindow.webContents.on('will-navigate', (e, navURL) => {

            // TODO: this is a bit of a hack and these URLs shouldn't be hard
            // coded here.  We can refactor this in the future though.

            const parsedURL = new URL(navURL);

            const host = parsedURL.hostname;

            if (host === "localhost") {
                log.info("Always allowing localhost URL");
                return;
            }

            if (ExternalNavigationBlock.get()) {

                log.info("Attempt to navigate to new URL: ", navURL);
                // required to force the URLs clicked to open in a new browser.  The
                // user probably / certainly wants to use their main browser.
                e.preventDefault();
                shell.openExternal(navURL)
                    .catch(err => log.error("Cloud open external URL", err, url));

            } else {
                log.notice("Allowing external navigation to: " + navURL);
                return;
            }

        });

        // compute the userAgent that we should be using for the renderer
        const userAgent = ElectronUserAgents.computeUserAgentFromWebContents(browserWindow.webContents);

        log.info("Loading URL: " + url);
        browserWindow.loadURL(url, {userAgent})
            .catch(err => log.error("Could not load URL ", err, url));

        return new Promise<BrowserWindow>(resolve => {

            browserWindow.once('ready-to-show', () => {

                // As of Electron 3.0 beta8 there appears to be a bug where
                // it persists teh zoom factor between restarts and restores
                // the zoom factor for the user but this can break / confuse
                // PHZ loading so we always want them to start at 1.0
                browserWindow.webContents.zoomFactor = 1.0;

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

