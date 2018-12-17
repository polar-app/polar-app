import {app, BrowserWindow, dialog} from 'electron';
import {ResourcePaths} from '../../electron/webresource/ResourcePaths';
import {Logger} from '../../logger/Logger';
import {Services} from '../../util/services/Services';
import {FileLoader} from './loaders/FileLoader';
import {Datastore} from '../../datastore/Datastore';
import {Webserver} from '../../backend/webserver/Webserver';
import {BROWSER_WINDOW_OPTIONS, MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {AppLauncher} from './AppLauncher';
import {Hashcodes} from '../../Hashcodes';
import {SingletonBrowserWindow} from '../../electron/framework/SingletonBrowserWindow';
import process from 'process';
import BrowserRegistry from '../../capture/BrowserRegistry';
import {BrowserProfiles} from '../../capture/BrowserProfiles';
import {Capture} from '../../capture/Capture';
import MenuItem = Electron.MenuItem;
import {Directories} from '../../datastore/Directories';
import {FileImportClient} from '../repository/FileImportClient';
import {PDFImporter} from '../repository/importers/PDFImporter';
import {PersistenceLayer} from '../../datastore/PersistenceLayer';
import {Messenger} from '../../electron/messenger/Messenger';
import {TriggerBrowserLoad} from '../browser/BrowserApp';
import {CaptureOpts} from '../../capture/CaptureOpts';

const log = Logger.create();

export class MainAppController {

    private readonly fileLoader: FileLoader;

    private readonly webserver: Webserver;

    private readonly directories: Directories;

    constructor(fileLoader: FileLoader,
                webserver: Webserver) {
        this.fileLoader = fileLoader;
        this.webserver = webserver;
        this.directories = new Directories();
    }

    public async cmdCaptureWebPage() {

        const browserWindowOptions = Object.assign({}, BROWSER_WINDOW_OPTIONS);

        browserWindowOptions.width = browserWindowOptions.width! * .9;
        browserWindowOptions.height = browserWindowOptions.height! * .9;
        browserWindowOptions.center = true;

        const url = ResourcePaths.resourceURLFromRelativeURL('./apps/capture/start-capture/index.html');

        await MainAppBrowserWindowFactory.createWindow(browserWindowOptions, url);

    }

    public async cmdCaptureWebPageWithBrowser(captureOpts: Partial<CaptureOpts> = {}) {

        const captureResult = await Capture.trigger(captureOpts);
        await this.handleLoadDoc(captureResult.path);

    }

    public async cmdNewWindow() {
        await MainAppBrowserWindowFactory.createWindow();
    }

    public async cmdImport() {

        const files = await this.promptImportDocs();

        // send the messages to the renderer context now so that we can bulk
        // import them into the repo.
        FileImportClient.send({files});

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

        log.info("Shutting down services...");
        Services.stop({
            webserver: this.webserver,
        });
        log.info("Shutting down services...done");

        log.info("Closing all windows...");

        BrowserWindow.getAllWindows().forEach(window => {
            const id = window.id;
            const url = window.webContents.getURL();
            log.info(`Closing window id=${id}, url=${url}`);
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
    public async handleLoadDoc(path: string,
                               newWindow: boolean = true): Promise<BrowserWindow> {

        const extraTags = {'type': 'viewer'};

        const browserWindowTag = {name: 'viewer', value: Hashcodes.createID(path)};

        return await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {

            let window;

            if (newWindow) {
                window = await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, 'about:blank');
            } else {
                window = BrowserWindow.getFocusedWindow()!;
            }

            return await this.loadDoc(path, window);

        }, extraTags);

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

        targetWindow.webContents.once('did-finish-load', () => {

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
    private async promptImportDocs(): Promise<string[]> {

        const downloadsDir = app.getPath('downloads');

        return new Promise<string[]>((resolve) => {

            dialog.showOpenDialog({
                  title: "Import Document",
                  defaultPath: downloadsDir,
                  filters: [
                      { name: 'Docs', extensions: ['pdf', "phz"] }
                  ],
                  properties: ['openFile', 'multiSelections']
                  // properties: ['openFile']
              }, (paths) => {

                resolve(paths);

            });

        });

    }

}

export interface FileImportRequest {

    /**
     * The array of files to import.
     */
    readonly files: string[];

}
