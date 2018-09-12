import {app, BrowserWindow, dialog} from 'electron';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {Logger} from '../../logger/Logger';
import {Services} from '../../util/services/Services';
import {FileLoader} from './loaders/FileLoader';
import {Datastore} from '../../datastore/Datastore';
import {Webserver} from '../../backend/webserver/Webserver';
import {ProxyServer} from '../../backend/proxyserver/ProxyServer';
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import MenuItem = Electron.MenuItem;
import {AppLauncher} from './AppLauncher';
import {Hashcodes} from '../../Hashcodes';
import {SingletonBrowserWindow} from '../../electron/framework/SingletonBrowserWindow';
import process from 'process';
import {BrowserApp} from '../browser/BrowserApp';
import BrowserRegistry from '../../capture/BrowserRegistry';
import {BrowserProfiles} from '../../capture/BrowserProfiles';
import {Capture} from '../../capture/Capture';

const log = Logger.create();

export class MainAppController {

    constructor(fileLoader: FileLoader, datastore: Datastore, webserver: Webserver, proxyServer: ProxyServer) {
        this.fileLoader = fileLoader;
        this.datastore = datastore;
        this.webserver = webserver;
        this.proxyServer = proxyServer;
    }

    private readonly fileLoader: FileLoader;

    private readonly datastore: Datastore;

    private readonly webserver: Webserver;

    private readonly proxyServer: ProxyServer;

    public async cmdCaptureWebPage() {

        const browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        browserWindowOptions.width = browserWindowOptions.width! * .9;
        browserWindowOptions.height = browserWindowOptions.height! * .9;
        browserWindowOptions.center = true;

        const url = AppPaths.resource('./apps/capture/start-capture/index.html');

        await MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);

    }

    public async cmdCaptureWebPageWithBrowser() {

        const browser = BrowserRegistry.DEFAULT;

        const browserProfile = BrowserProfiles.toBrowserProfile(browser, 'DEFAULT');

        const capture = new Capture(browserProfile);

        const captureResult = await capture.start();

        await this.handleLoadDoc(captureResult.path);

    }

    /**
     * Load a PDF file when given a full URL.  May be file, http, or https URL.
     */
    public async cmdOpen(item: MenuItem, focusedWindow: BrowserWindow) {

        const targetWindow = focusedWindow;

        const path = await this.promptDoc();

        await this.loadDoc(path, targetWindow);

    }

    public async cmdNewWindow() {
        await MainAppBrowserWindowFactory.createWindow();
    }

    public async cmdOpenInNewWindow() {

        const path = await this.promptDoc();

        const targetWindow = await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, "about:blank");

        await this.loadDoc(path, targetWindow);

    }

    public cmdExit() {
        this.exitApp();
    }

    public cmdToggleDevTools(item: MenuItem, focusedWindow: BrowserWindow) {
        log.info("Toggling dev tools in: " + focusedWindow);
        focusedWindow.webContents.toggleDevTools();
    }

    public exitApp() {

        log.info("Exiting app...");

        Services.stop({
            webserver: this.webserver,
            proxyServer: this.proxyServer
        });

        log.info("Closing all windows...");

        BrowserWindow.getAllWindows().forEach(window => {
            log.info("Closing window: " + window.id);
            window.close();
        });

        log.info("Closing all windows...done");

        log.info("Exiting electron...");

        app.quit();

        log.info("Exiting main...");
        process.exit();

    }

    /**
     * The user asked to open a file from the command line or via OS event.
     */
    public async handleLoadDoc(path: string, newWindow: boolean = true): Promise<BrowserWindow> {

        const browserWindowTag = {name: 'viewer:', value: Hashcodes.createID(path)};

        return await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {

            let window;

            if (newWindow) {
                window = await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, 'about:blank');
            } else {
                window = BrowserWindow.getFocusedWindow()!;
            }

            return await this.loadDoc(path, window);

        });

    }

    /**
     * Load the given PDF file in the given target window.
     */
    public async loadDoc(path: string, targetWindow: BrowserWindow): Promise<BrowserWindow> {

        if (!targetWindow) {
            throw new Error("No target window given");
        }

        const loadedFile = await this.fileLoader.registerForLoad(path);

        log.info("Loading webapp at: " + loadedFile.webResource);

        loadedFile.webResource.load(targetWindow);

        targetWindow.webContents.once('did-finish-load', function() {

            if (loadedFile.title) {
                // TODO: this should be driven from the DocMeta and the DocMeta
                // should be initialized from the descriptor.
                targetWindow.setTitle(loadedFile.title);
            }

            if (loadedFile.docDimensions) {

                const [width, height] = targetWindow.getSize();

                // compute the ideal width plus a small buffer for the sides.
                const idealWidth = loadedFile.docDimensions.width + 100;

                if (width < idealWidth) {
                    log.info("Adjusting window width");
                    targetWindow.setSize(idealWidth, height);
                }

            }

        });

        return targetWindow;

    }

    public activateMainWindow() {

        let browserWindows = BrowserWindow.getAllWindows();

        browserWindows = browserWindows.filter( browserWindow => browserWindow.isVisible());

        if (browserWindows.length === 0) {

            AppLauncher.launchRepositoryApp()
                .catch(err => log.error("Unable to open repository app: ", err));

            return;
        }

        const mainWindow = browserWindows[0];

        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.focus();

    }


    /**
     * Open a dialog box for a PDF file.
     */
    private async promptDoc(): Promise<string> {

        return new Promise<string>((resolve) => {

            dialog.showOpenDialog({
                  title: "Open Document",
                  defaultPath: this.datastore.stashDir,
                  filters: [
                      { name: 'Docs', extensions: ['pdf', "phz"] }
                  ],
                  properties: ['openFile']
              }, (path) => {

                if (path) {
                    resolve(path[0]);
                }

            });

        });

    }

}
