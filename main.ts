import {app, BrowserWindow, Menu} from 'electron';

import {MainAppController} from "./web/js/apps/main/MainAppController";
import {MainBrowserWindowFactory} from './web/js/apps/main/MainBrowserWindowFactory';
import {WebserverConfig} from './web/js/backend/webserver/WebserverConfig';
import {FileRegistry} from './web/js/backend/webserver/FileRegistry';
import {ProxyServerConfig} from './web/js/backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from './web/js/backend/proxyserver/CacheRegistry';
import {DialogWindowService} from './web/js/ui/dialog_window/DialogWindowService';
import {ProxyServer} from './web/js/backend/proxyserver/ProxyServer';
import {Cmdline} from './web/js/electron/Cmdline';
import {Webserver} from './web/js/backend/webserver/Webserver';
import {Directories} from './web/js/datastore/Directories';
import {Logger} from './web/js/logger/Logger';
import {MemoryDatastore} from './web/js/datastore/MemoryDatastore';
import {DiskDatastore} from './web/js/datastore/DiskDatastore';
import {CacheInterceptorService} from './web/js/backend/interceptor/CacheInterceptorService';
import {MainAppMenu} from './web/js/apps/main/MainAppMenu';
import {CaptureController} from './web/js/capture/controller/CaptureController';
import {DefaultFileLoader} from './web/js/apps/main/loaders/DefaultFileLoader';
import {AnalyticsFileLoader} from './web/js/apps/main/loaders/AnalyticsFileLoader';

const log = Logger.create();


// enable the debugging port for chrome for now.  We should probably have an
// --enable-remote-debugging command line flag that would need to be set
// because I don't want to have to keep this port open all the time.

const WEBSERVER_PORT = 8500;
const PROXYSERVER_PORT = 8600;

declare var global: any;

let hasSingleInstanceLock = app.requestSingleInstanceLock();

if( ! hasSingleInstanceLock) {
    log.info("Quiting.  App is single instance.");
    app.quit();
}

/**
 * Process app command line args and return an object to work with them
 * directly.
 */
function parseArgs() {

    // FIXME: move this to apps.main.Args

    return {

        enableConsoleLogging: process.argv.includes("--enable-console-logging"),

        enableRemoteDebugging: process.argv.includes("--enable-remote-debugging"),
        enableDevTools: process.argv.includes("--enable-dev-tools"),

        // use this option to write to the MEMORY datastore. not the disk
        // datastore.. This way we can test without impacting persistence.
        enableMemoryDatastore: process.argv.includes("--enable-memory-datastore")

    };

}

let args = parseArgs();
let datastore = null;

// TODO: there needs to be a similar concept of the Loader for the main process.

const webserverConfig = new WebserverConfig(app.getAppPath(), WEBSERVER_PORT);
const fileRegistry = new FileRegistry(webserverConfig);

const proxyServerConfig = new ProxyServerConfig(PROXYSERVER_PORT);
const cacheRegistry = new CacheRegistry(proxyServerConfig);

const directories = new Directories();

let captureController = new CaptureController({directories, cacheRegistry});

let dialogWindowService = new DialogWindowService();

let defaultFileLoader = new DefaultFileLoader(fileRegistry, cacheRegistry);

let fileLoader;

let webserver;

let proxyServer;


app.on('ready', async function() {

    // FIXME: move this to MainApp

    log.info("Loaded from: ", app.getAppPath());

    // NOTE: removing the next three lines removes the colors in the toolbar.
    //const appIcon = new Tray(app_icon);
    //appIcon.setToolTip('Polar Bookshelf');
    //appIcon.setContextMenu(contextMenu);

    let mainWindow = await MainBrowserWindowFactory.createWindow();

    await directories.init();

    // TODO don't use directory logging now as it is broken.
    //await Logger.init(directories.logsDir);

    if(args.enableMemoryDatastore) {
        datastore = new MemoryDatastore();
    } else {
        datastore = new DiskDatastore();
    }

    await datastore.init();

    // share the disk datastore with the remote.

    global.datastore = datastore;

    log.info("Electron app path is: " + app.getAppPath());

    // *** start the webserver

    webserver = new Webserver(webserverConfig, fileRegistry);
    webserver.start();

    // *** start the proxy server

    proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
    proxyServer.start();

    let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);
    await cacheInterceptorService.start();

    await captureController.start();
    await dialogWindowService.start();

    fileLoader = new AnalyticsFileLoader(mainWindow.webContents.getUserAgent(), defaultFileLoader);

    log.info("Running with process.args: ", JSON.stringify(process.argv));

    if(args.enableDevTools) {
        mainWindow.webContents.toggleDevTools();
    }

    // if there is a PDF file to open, load that, otherwise, load the default URL.

    // FIXME: handleCmdLinePDF(process.argv, false).catch((err) => log.error(err));

    // FIXME: ... there's a catch/22 here creating the main window... we need
    // the main Window created so that we can init the loader...

    let mainAppController = new MainAppController(fileLoader, datastore, webserver, proxyServer);

    // TODO: handle the command line here.. IE if someone opens up a file via
    // argument.

    let mainAppMenu = new MainAppMenu(mainAppController);
    mainAppMenu.setup();

    app.on('open-file', async (event, path) => {

        log.info("Open file called for: ", path);

        await mainAppController.handleLoadDoc(path);

    });

    app.on('second-instance', async (event, commandLine, workingDirectory) => {

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

});
