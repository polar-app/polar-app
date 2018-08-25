"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const MainAppController_1 = require("./web/js/apps/main/MainAppController");
const MainBrowserWindowFactory_1 = require("./web/js/apps/main/MainBrowserWindowFactory");
const WebserverConfig_1 = require("./web/js/backend/webserver/WebserverConfig");
const FileRegistry_1 = require("./web/js/backend/webserver/FileRegistry");
const ProxyServerConfig_1 = require("./web/js/backend/proxyserver/ProxyServerConfig");
const CacheRegistry_1 = require("./web/js/backend/proxyserver/CacheRegistry");
const DialogWindowService_1 = require("./web/js/ui/dialog_window/DialogWindowService");
const ProxyServer_1 = require("./web/js/backend/proxyserver/ProxyServer");
const Cmdline_1 = require("./web/js/electron/Cmdline");
const Webserver_1 = require("./web/js/backend/webserver/Webserver");
const Directories_1 = require("./web/js/datastore/Directories");
const Logger_1 = require("./web/js/logger/Logger");
const MemoryDatastore_1 = require("./web/js/datastore/MemoryDatastore");
const DiskDatastore_1 = require("./web/js/datastore/DiskDatastore");
const CacheInterceptorService_1 = require("./web/js/backend/interceptor/CacheInterceptorService");
const MainAppMenu_1 = require("./web/js/apps/main/MainAppMenu");
const CaptureController_1 = require("./web/js/capture/controller/CaptureController");
const DefaultFileLoader_1 = require("./web/js/apps/main/loaders/DefaultFileLoader");
const AnalyticsFileLoader_1 = require("./web/js/apps/main/loaders/AnalyticsFileLoader");
const log = Logger_1.Logger.create();
const WEBSERVER_PORT = 8500;
const PROXYSERVER_PORT = 8600;
let hasSingleInstanceLock = electron_1.app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
    log.info("Quiting.  App is single instance.");
    electron_1.app.quit();
}
function parseArgs() {
    return {
        enableConsoleLogging: process.argv.includes("--enable-console-logging"),
        enableRemoteDebugging: process.argv.includes("--enable-remote-debugging"),
        enableDevTools: process.argv.includes("--enable-dev-tools"),
        enableMemoryDatastore: process.argv.includes("--enable-memory-datastore")
    };
}
let args = parseArgs();
let datastore = null;
const webserverConfig = new WebserverConfig_1.WebserverConfig(electron_1.app.getAppPath(), WEBSERVER_PORT);
const fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
const proxyServerConfig = new ProxyServerConfig_1.ProxyServerConfig(PROXYSERVER_PORT);
const cacheRegistry = new CacheRegistry_1.CacheRegistry(proxyServerConfig);
const directories = new Directories_1.Directories();
let captureController = new CaptureController_1.CaptureController({ directories, cacheRegistry });
let dialogWindowService = new DialogWindowService_1.DialogWindowService();
let defaultFileLoader = new DefaultFileLoader_1.DefaultFileLoader(fileRegistry, cacheRegistry);
let fileLoader;
let webserver;
let proxyServer;
electron_1.app.on('ready', function () {
    return __awaiter(this, void 0, void 0, function* () {
        log.info("Loaded from: ", electron_1.app.getAppPath());
        let mainWindow = yield MainBrowserWindowFactory_1.MainBrowserWindowFactory.createWindow();
        yield directories.init();
        if (args.enableMemoryDatastore) {
            datastore = new MemoryDatastore_1.MemoryDatastore();
        }
        else {
            datastore = new DiskDatastore_1.DiskDatastore();
        }
        yield datastore.init();
        global.datastore = datastore;
        log.info("Electron app path is: " + electron_1.app.getAppPath());
        webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
        webserver.start();
        proxyServer = new ProxyServer_1.ProxyServer(proxyServerConfig, cacheRegistry);
        proxyServer.start();
        let cacheInterceptorService = new CacheInterceptorService_1.CacheInterceptorService(cacheRegistry);
        yield cacheInterceptorService.start();
        yield captureController.start();
        yield dialogWindowService.start();
        fileLoader = new AnalyticsFileLoader_1.AnalyticsFileLoader(mainWindow.webContents.getUserAgent(), defaultFileLoader);
        log.info("Running with process.args: ", JSON.stringify(process.argv));
        if (args.enableDevTools) {
            mainWindow.webContents.toggleDevTools();
        }
        let mainAppController = new MainAppController_1.MainAppController(fileLoader, datastore, webserver, proxyServer);
        let mainAppMenu = new MainAppMenu_1.MainAppMenu(mainAppController);
        mainAppMenu.setup();
        electron_1.app.on('open-file', (event, path) => __awaiter(this, void 0, void 0, function* () {
            log.info("Open file called for: ", path);
            yield mainAppController.handleLoadDoc(path);
        }));
        electron_1.app.on('second-instance', (event, commandLine, workingDirectory) => __awaiter(this, void 0, void 0, function* () {
            log.info("Someone opened a second instance.");
            let fileArg = Cmdline_1.Cmdline.getDocArg(commandLine);
            if (fileArg) {
                yield mainAppController.handleLoadDoc(fileArg);
            }
            else {
                mainAppController.activateMainWindow();
            }
        }));
        electron_1.app.on('window-all-closed', function () {
            log.info("No windows left. Quitting app.");
            mainAppController.exitApp();
        });
        electron_1.app.on('activate', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield MainBrowserWindowFactory_1.MainBrowserWindowFactory.createWindow();
            });
        });
    });
});
//# sourceMappingURL=main.js.map