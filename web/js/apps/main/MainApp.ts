import {app} from 'electron';
import {WebserverConfig} from '../../backend/webserver/WebserverConfig';
import {FileRegistry} from '../../backend/webserver/FileRegistry';
import {ProxyServerConfig} from '../../backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from '../../backend/proxyserver/CacheRegistry';
import {Directories} from '../../datastore/Directories';
import {CaptureController} from '../../capture/controller/CaptureController';
import {DialogWindowService} from '../../ui/dialog_window/DialogWindowService';
import {DefaultFileLoader} from './loaders/DefaultFileLoader';
import {MainBrowserWindowFactory} from './MainBrowserWindowFactory';
import {MemoryDatastore} from '../../datastore/MemoryDatastore';
import {DiskDatastore} from '../../datastore/DiskDatastore';
import {Webserver} from '../../backend/webserver/Webserver';
import {ProxyServer} from '../../backend/proxyserver/ProxyServer';
import {CacheInterceptorService} from '../../backend/interceptor/CacheInterceptorService';
import {AnalyticsFileLoader} from './loaders/AnalyticsFileLoader';
import {MainAppController} from './MainAppController';
import {MainAppMenu} from './MainAppMenu';
import {Cmdline} from '../../electron/Cmdline';
import {Logger} from '../../logger/Logger';
import {Datastore} from '../../datastore/Datastore';
import {ScreenshotService} from '../../screenshots/ScreenshotService';
import {MainAppService} from './ipc/MainAppService';

declare var global: any;

const log = Logger.create();

const WEBSERVER_PORT = 8500;
const PROXYSERVER_PORT = 8600;

export class MainApp {

    private readonly opts: MainAppOpts;

    private readonly datastore: Datastore;

    constructor(datastore: Datastore, opts: MainAppOpts = {}) {
        this.datastore = datastore;
        this.opts = opts;
    }

    public async start(): Promise<MainAppController> {

        // share the disk datastore with the remote.

        global.datastore = this.datastore;

        const webserverConfig = new WebserverConfig(app.getAppPath(), WEBSERVER_PORT);
        const fileRegistry = new FileRegistry(webserverConfig);

        const proxyServerConfig = new ProxyServerConfig(PROXYSERVER_PORT);
        const cacheRegistry = new CacheRegistry(proxyServerConfig);

        const directories = new Directories();

        let captureController = new CaptureController({directories, cacheRegistry});

        let dialogWindowService = new DialogWindowService();

        let defaultFileLoader = new DefaultFileLoader(fileRegistry, cacheRegistry);

        let screenshotService = new ScreenshotService();
        screenshotService.start();

        log.info("App loaded from: ", app.getAppPath());
        log.info("Stash dir: ", this.datastore.stashDir);
        log.info("Logs dir: ", this.datastore.logsDir);

        // NOTE: removing the next three lines removes the colors in the toolbar.
        //const appIcon = new Tray(app_icon);
        //appIcon.setToolTip('Polar Bookshelf');
        //appIcon.setContextMenu(contextMenu);

        let mainWindow = await MainBrowserWindowFactory.createWindow();

        await directories.init();

        // TODO don't use directory logging now as it is broken.
        //await Logger.init(directories.logsDir);

        log.info("Electron app path is: " + app.getAppPath());

        // *** start the webserver

        let webserver = new Webserver(webserverConfig, fileRegistry);
        webserver.start();

        // *** start the proxy server

        let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
        proxyServer.start();

        let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);
        await cacheInterceptorService.start();

        await captureController.start();
        await dialogWindowService.start();

        let fileLoader = new AnalyticsFileLoader(mainWindow.webContents.getUserAgent(), defaultFileLoader);

        log.info("Running with process.args: ", JSON.stringify(process.argv));

        // if there is a PDF file to open, load that, otherwise, load the default URL.

        // FIXME: handleCmdLinePDF(process.argv, false).catch((err) => log.error(err));

        // FIXME: ... there's a catch/22 here creating the main window... we need
        // the main Window created so that we can init the loader...

        let mainAppController = new MainAppController(fileLoader, this.datastore, webserver, proxyServer);

        let mainAppService = new MainAppService(mainAppController);
        mainAppService.start();

        // TODO: handle the command line here.. IE if someone opens up a file via
        // argument.

        let mainAppMenu = new MainAppMenu(mainAppController);
        mainAppMenu.setup();

        app.on('open-file', async (event, path) => {

            log.info("Open file called for: ", path);

            await mainAppController.handleLoadDoc(path);

        });

        app.on('second-instance', async (event, commandLine) => {

            // FIXME: focus the window now...

            log.info("Someone opened a second instance.");

            let fileArg = Cmdline.getDocArg(commandLine);

            if(fileArg) {
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

            await MainBrowserWindowFactory.createWindow();

        });

        return mainAppController;

    }

}

export interface MainAppOpts {


}
