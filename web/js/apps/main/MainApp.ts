import {app} from 'electron';
import {WebserverConfig} from '../../backend/webserver/WebserverConfig';
import {FileRegistry} from '../../backend/webserver/FileRegistry';
import {ProxyServerConfig} from '../../backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from '../../backend/proxyserver/CacheRegistry';
import {Directories} from '../../datastore/Directories';
import {CaptureController} from '../../capture/controller/CaptureController';
import {DialogWindowService} from '../../ui/dialog_window/DialogWindowService';
import {DefaultFileLoader} from './loaders/DefaultFileLoader';
import {MainAppBrowserWindowFactory} from './MainAppBrowserWindowFactory';
import {Webserver} from '../../backend/webserver/Webserver';
import {CacheInterceptorService} from '../../backend/interceptor/CacheInterceptorService';
import {AnalyticsFileLoader} from './loaders/AnalyticsFileLoader';
import {MainAppController} from './MainAppController';
import {MainAppMenu} from './MainAppMenu';
import {Cmdline} from '../../electron/Cmdline';
import {Logger} from '../../logger/Logger';
import {Datastore} from '../../datastore/Datastore';
import {ScreenshotService} from '../../screenshots/ScreenshotService';
import {MainAppService} from './ipc/MainAppService';
import {AppLauncher} from './AppLauncher';
import {DocInfoBroadcasterService} from '../../datastore/advertiser/DocInfoBroadcasterService';
import BrowserWindow = Electron.BrowserWindow;

declare var global: any;

const log = Logger.create();

const WEBSERVER_PORT = 8500;
const PROXYSERVER_PORT = 8600;

export class MainApp {

    private readonly datastore: Datastore;

    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    public async start(): Promise<MainAppStarted> {

        // share the disk datastore with the remote.

        global.datastore = this.datastore;

        const webserverConfig = new WebserverConfig(app.getAppPath(), WEBSERVER_PORT);
        const fileRegistry = new FileRegistry(webserverConfig);

        const proxyServerConfig = new ProxyServerConfig(PROXYSERVER_PORT);
        const cacheRegistry = new CacheRegistry(proxyServerConfig);

        const directories = new Directories();

        const captureController = new CaptureController(cacheRegistry);

        const dialogWindowService = new DialogWindowService();

        const defaultFileLoader = new DefaultFileLoader(fileRegistry, cacheRegistry);

        const screenshotService = new ScreenshotService();
        screenshotService.start();

        log.info("App loaded from: ", app.getAppPath());
        log.info("Stash dir: ", this.datastore.stashDir);
        log.info("Logs dir: ", this.datastore.logsDir);

        // NOTE: removing the next three lines removes the colors in the toolbar.
        // const appIcon = new Tray(app_icon);
        // appIcon.setToolTip('Polar Bookshelf');
        // appIcon.setContextMenu(contextMenu);

        const mainWindow = await AppLauncher.launchRepositoryApp();

        await directories.init();

        // TODO don't use directory logging now as it is broken.
        // await Logger.init(directories.logsDir);

        log.info("Electron app path is: " + app.getAppPath());

        // *** start the webserver

        const webserver = new Webserver(webserverConfig, fileRegistry);
        webserver.start();

        const cacheInterceptorService = new CacheInterceptorService(cacheRegistry);
        await cacheInterceptorService.start();

        await captureController.start();
        await dialogWindowService.start();

        const fileLoader = new AnalyticsFileLoader(mainWindow.webContents.getUserAgent(), defaultFileLoader);

        await new DocInfoBroadcasterService().start();

        log.info("Running with process.args: ", JSON.stringify(process.argv));

        // if there is a PDF file to open, load that, otherwise, load the default URL.

        // FIXME: handleCmdLinePDF(process.argv, false).catch((err) => log.error(err));

        // FIXME: ... there's a catch/22 here creating the main window... we need
        // the main Window created so that we can init the loader...

        const mainAppController = new MainAppController(fileLoader, this.datastore, webserver);

        const mainAppService = new MainAppService(mainAppController);
        mainAppService.start();

        // TODO: handle the command line here.. IE if someone opens up a file via
        // argument.

        const mainAppMenu = new MainAppMenu(mainAppController);
        mainAppMenu.setup();

        app.on('open-file', async (event, path) => {

            log.info("Open file called for: ", path);

            await mainAppController.handleLoadDoc(path);

        });

        app.on('second-instance', async (event, commandLine) => {

            // FIXME: focus the window now...

            log.info("Someone opened a second instance.");

            const fileArg = Cmdline.getDocArg(commandLine);

            if (fileArg) {
                await mainAppController.handleLoadDoc(fileArg);
            } else {
                mainAppController.activateMainWindow();
            }

        });

        // Quit when all windows are closed.
        app.on('window-all-closed', function() {

            // determine if we need to quit:
            log.info("No windows left. Quitting app.");

            mainAppController.exitApp();

        });

        app.on('activate', async function() {

            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.

            await MainAppBrowserWindowFactory.createWindow();

        });

        return {mainWindow, mainAppController};

    }

}

export interface MainAppStarted {
    mainWindow: BrowserWindow;
    mainAppController: MainAppController;
}
