import {app, BrowserWindow, dialog} from 'electron';
import {AppPaths} from '../../electron/webresource/AppPaths';
import {Logger} from '../../logger/Logger';
import {Services} from '../../util/services/Services';
import {FileLoader} from './loaders/FileLoader';
import {Datastore} from '../../datastore/Datastore';
import {Webserver} from '../../backend/webserver/Webserver';
import {ProxyServer} from '../../backend/proxyserver/ProxyServer';
import {BROWSER_WINDOW_OPTIONS, MainBrowserWindowFactory} from './MainBrowserWindowFactory';
import MenuItem = Electron.MenuItem;

const process = require('process');

const log = Logger.create();

export class MainAppController {

    private readonly fileLoader: FileLoader;

    private readonly datastore: Datastore;

    private readonly webserver: Webserver;

    private readonly proxyServer: ProxyServer;

    constructor(fileLoader: FileLoader, datastore: Datastore, webserver: Webserver, proxyServer: ProxyServer) {
        this.fileLoader = fileLoader;
        this.datastore = datastore;
        this.webserver = webserver;
        this.proxyServer = proxyServer;
    }

    public async cmdCaptureWebPage() {

        let browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        browserWindowOptions.width = browserWindowOptions.width! * .9;
        browserWindowOptions.height = browserWindowOptions.height! * .9;
        browserWindowOptions.center = true;

        let url = AppPaths.resource('./apps/capture/start-capture/index.html')

        await MainBrowserWindowFactory.createWindow(browserWindowOptions, url);


    }

    /**
     * Load a PDF file when given a full URL.  May be file, http, or https URL.
     */
    public async cmdOpen(item: MenuItem, focusedWindow: BrowserWindow) {

        let targetWindow = focusedWindow;

        let path = await this.promptDoc();

        await this.loadDoc(path, targetWindow);

    }

    public async cmdNewWindow() {
        await MainBrowserWindowFactory.createWindow();
    }

    public async cmdOpenInNewWindow() {

        let path = await this.promptDoc();

        let targetWindow = await MainBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, "about:blank");

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

        log.info("Exiting electron...");

        app.quit();

        log.info("Exiting main...");
        process.exit();

    }

    /**
     * The user asked to open a file from the command line or via OS event.
     */
    public async handleLoadDoc(path: string, newWindow: boolean = true) {

        let window;

        if(newWindow) {
            window = await MainBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, 'about:blank');
        } else {
            window = BrowserWindow.getFocusedWindow()!;
        }

        await this.loadDoc(path, window);

    }

    /**
     * Load the given PDF file in the given target window.
     */
    public async loadDoc(path: string, targetWindow: BrowserWindow) {

        if(!targetWindow) {
            throw new Error("No target window given");
        }

        let loadedFile = await this.fileLoader.registerForLoad(path);

        log.info("Loading webapp at: " + loadedFile.webResource);

        loadedFile.webResource.load(targetWindow);

        targetWindow.webContents.once('did-finish-load', function() {

            if(loadedFile.title) {
                // TODO: this should be driven from the DocMeta and the DocMeta
                // should be initialized from the descriptor.
                targetWindow.setTitle(loadedFile.title);
            }

        });

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

    public activateMainWindow() {

        let browserWindows = BrowserWindow.getAllWindows();

        browserWindows = browserWindows.filter( browserWindow => browserWindow.isVisible())

        if(browserWindows.length === 0) {
            return;
        }

        let mainWindow = browserWindows[0];

        if (mainWindow.isMinimized())
            mainWindow.restore();

        mainWindow.focus();

    }


}
