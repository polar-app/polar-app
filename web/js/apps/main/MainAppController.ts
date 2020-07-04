import {app, BrowserWindow, dialog} from 'electron';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Services} from '../../util/services/Services';
import {
    BROWSER_WINDOW_OPTIONS,
    MainAppBrowserWindowFactory
} from './MainAppBrowserWindowFactory';
import {AppLauncher} from './AppLauncher';
import {Hashcodes} from 'polar-shared/src/util/Hashcodes';
import {SingletonBrowserWindow} from '../../electron/framework/SingletonBrowserWindow';
import process from 'process';
import {Directories} from '../../datastore/Directories';
import {FileImportClient} from '../repository/FileImportClient';
import {MainAppExceptionHandlers} from './MainAppExceptionHandlers';
import {FileImportRequests} from '../repository/FileImportRequests';
import {Webserver} from "polar-shared-webserver/src/webserver/Webserver";
import {PathStr, URLStr} from "polar-shared/src/util/Strings";
import MenuItem = Electron.MenuItem;

const log = Logger.create();

export class MainAppController {

    private readonly webserver: Webserver;

    private readonly directories: Directories;

    constructor(webserver: Webserver) {
        this.webserver = webserver;
        this.directories = new Directories();
    }

    public async cmdImport() {

        const files = await this.promptImportDocs();

        // send the messages to the renderer context now so that we can bulk
        // import them into the repo.
        if (files) {
            const fileImportRequests = FileImportRequests.fromPaths(files);
            FileImportClient.send(fileImportRequests);
        }

    }

    public cmdExit() {
        this.exitApp();
    }

    public cmdToggleDevTools(item: MenuItem, focusedWindow: BrowserWindow) {
        log.info("Toggling dev tools in: " + focusedWindow);
        focusedWindow.webContents.toggleDevTools();
    }

    public exitApp() {

        // we have a collection of flags here controlling shutdown as Electron
        // is picky in some situations regarding raising exceptions and we're
        // still trying to track down the proper way to handle app quit.

        const doProcessExit = true;
        const doAppQuit = true;
        const doServicesStop = true;

        const doWindowGC = false;

        const doCloseWindows = false;
        const doDestroyWindows = false;

        // the exception handlers need to be re-registered as I think they're
        // being removed on exit (possibly by sentry?)
        MainAppExceptionHandlers.register();

        log.info("Exiting app...");

        if (doWindowGC) {

            log.info("Getting all browser windows...");
            const browserWindows = BrowserWindow.getAllWindows();
            log.info("Getting all browser windows...done");

            log.info("Closing/destroying all windows...");

            for (const browserWindow of browserWindows) {
                const id = browserWindow.id;

                if (! browserWindow.isDestroyed()) {

                    if (doCloseWindows && browserWindow.isClosable()) {
                        log.info(`Closing window id=${id}`);
                        browserWindow.close();
                    }

                    if (doDestroyWindows) {
                        log.info(`Destroying window id=${id}`);
                        browserWindow.destroy();
                    }

                } else {
                    log.info(`Skipping destroy window (is destroyed) id=${id}`);
                }

            }

            log.info("Closing/destroying all windows...done");

        }

        if (doServicesStop) {

            log.info("Stopping services...");

            Services.stop({
                webserver: this.webserver,
            });

            log.info("Stopping services...done");

        }

        if (doAppQuit) {
            log.info("Quitting app...");

            app.quit();

            log.info("Quitting app...done");
        }

        if (doProcessExit) {
            log.info("Process exit...");
            process.exit();
            log.info("Process exit...done");
        }

    }

    /**
     * The user asked to open a file from the command line or via OS event.
     */
    public async handleLoadDoc(url: URLStr,
                               newWindow: boolean = true): Promise<BrowserWindow> {

        const extraTags = {'type': 'viewer'};

        const browserWindowTag = {name: 'viewer', value: Hashcodes.createID(url)};

        return await SingletonBrowserWindow.getInstance(browserWindowTag, async () => {

            const computeWindow = async () => {

                const createWindow = async () => {
                    return await MainAppBrowserWindowFactory.createWindow(BROWSER_WINDOW_OPTIONS, url);
                };

                if (newWindow) {
                    return createWindow();
                }

                const focusedWindow = BrowserWindow.getFocusedWindow();

                if (focusedWindow) {
                    return focusedWindow;
                } else {
                    return await createWindow();
                }

            };

            return await computeWindow();

        }, extraTags);

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
    private async promptImportDocs(): Promise<ReadonlyArray<PathStr> | undefined> {

        const downloadsDir = app.getPath('downloads');

        const openedDialog = await dialog.showOpenDialog({
            title: "Import Document",
            defaultPath: downloadsDir,
            filters: [
                { name: 'Docs', extensions: ['pdf', "PDF", 'epub', 'EPUB'] }
            ],
            properties: ['openFile', 'multiSelections']
            // properties: ['openFile']
        });

        if (openedDialog.canceled) {
            return undefined;
        }

        return openedDialog.filePaths;

    }

}

