"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppBrowserWindowFactory = exports.BROWSER_WINDOW_OPTIONS = exports.APP_ICON = exports.MAIN_SESSION_PARTITION_NAME = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const ResourcePaths_1 = require("../../electron/webresource/ResourcePaths");
const ElectronUserAgents_1 = require("../electron_browser/ElectronUserAgents");
const ExternalNavigationBlock_1 = require("../../electron/navigation/ExternalNavigationBlock");
const log = Logger_1.Logger.create();
const WIDTH = 900 * 1.2;
const HEIGHT = 1100 * 1.2;
const SIDEBAR_BUFFER = 100;
const DEFAULT_URL = ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL('./apps/repository/index.html');
exports.MAIN_SESSION_PARTITION_NAME = 'persist:polar-app';
exports.APP_ICON = ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL('./icon.png');
exports.BROWSER_WINDOW_OPTIONS = Object.freeze({
    backgroundColor: '#FFF',
    width: WIDTH + SIDEBAR_BUFFER,
    height: HEIGHT,
    show: false,
    icon: exports.APP_ICON,
    webPreferences: {
        nodeIntegration: true,
        defaultEncoding: 'UTF-8',
        webSecurity: false,
        webaudio: true,
        partition: exports.MAIN_SESSION_PARTITION_NAME,
    }
});
class MainAppBrowserWindowFactory {
    static createWindow(browserWindowOptions = exports.BROWSER_WINDOW_OPTIONS, url = DEFAULT_URL) {
        browserWindowOptions = Object.assign({}, browserWindowOptions);
        const position = this.computeXY();
        if (position) {
            browserWindowOptions.x = position.x;
            browserWindowOptions.y = position.y;
        }
        const display = electron_1.screen.getPrimaryDisplay();
        const dimensionMappings = [
            { original: 'minHeight', dimension: 'height', defaultValue: 800 },
            { original: 'minWidth', dimension: 'width', defaultValue: 600 },
            { original: 'height', dimension: 'height' },
            { original: 'width', dimension: 'width' }
        ];
        for (const dimensionMapping of dimensionMappings) {
            const current = browserWindowOptions[dimensionMapping.original] || dimensionMapping.defaultValue;
            const max = display.size[dimensionMapping.dimension];
            browserWindowOptions[dimensionMapping.original]
                = Math.min(current, max);
        }
        const browserWindow = new electron_1.BrowserWindow(browserWindowOptions);
        browserWindow.webContents.on('new-window', (e, newURL) => {
            if (ExternalNavigationBlock_1.ExternalNavigationBlock.get()) {
                e.preventDefault();
                electron_1.shell.openExternal(newURL)
                    .catch(err => log.error("Could not open external URL", err, newURL));
            }
            else {
                log.notice("Allowing external navigation to new window URL: " + newURL);
            }
        });
        browserWindow.webContents.on('will-navigate', (e, navURL) => {
            const parsedURL = new URL(navURL);
            const host = parsedURL.hostname;
            if (host === "localhost") {
                log.info("Always allowing localhost URL");
                return;
            }
            if (ExternalNavigationBlock_1.ExternalNavigationBlock.get()) {
                log.info("Attempt to navigate to new URL: ", navURL);
                e.preventDefault();
                electron_1.shell.openExternal(navURL)
                    .catch(err => log.error("Cloud open external URL", err, url));
            }
            else {
                log.notice("Allowing external navigation to: " + navURL);
                return;
            }
        });
        const userAgent = ElectronUserAgents_1.ElectronUserAgents.computeUserAgentFromWebContents(browserWindow.webContents);
        log.info("Loading URL: " + url);
        browserWindow.loadURL(url, { userAgent })
            .catch(err => log.error("Could not load URL ", err, url));
        return new Promise(resolve => {
            browserWindow.once('ready-to-show', () => {
                browserWindow.webContents.zoomFactor = 1.0;
                browserWindow.show();
                resolve(browserWindow);
            });
        });
    }
    static computeXY() {
        const offset = 35;
        const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
        if (focusedWindow) {
            const position = focusedWindow.getPosition();
            let x = position[0];
            let y = position[1];
            x += offset;
            y += offset;
            return { x, y };
        }
        return undefined;
    }
}
exports.MainAppBrowserWindowFactory = MainAppBrowserWindowFactory;
//# sourceMappingURL=MainAppBrowserWindowFactory.js.map