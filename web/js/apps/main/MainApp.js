"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainApp = void 0;
const electron_1 = require("electron");
const Directories_1 = require("../../datastore/Directories");
const MainAppController_1 = require("./MainAppController");
const MainAppMenu_1 = require("./MainAppMenu");
const Cmdline_1 = require("../../electron/Cmdline");
const Logger_1 = require("polar-shared/src/logger/Logger");
const ScreenshotService_1 = require("../../screenshots/electron/ScreenshotService");
const AppLauncher_1 = require("./AppLauncher");
const DocInfoBroadcasterService_1 = require("../../datastore/advertiser/DocInfoBroadcasterService");
const process_1 = __importDefault(require("process"));
const AppPath_1 = require("../../electron/app_path/AppPath");
const MainAPI_1 = require("./MainAPI");
const MainAppExceptionHandlers_1 = require("./MainAppExceptionHandlers");
const FileImportClient_1 = require("../repository/FileImportClient");
const RendererAnalyticsService_1 = require("../../ga/RendererAnalyticsService");
const FileImportRequests_1 = require("../repository/FileImportRequests");
const DefaultRewrites_1 = require("polar-backend-shared/src/webserver/DefaultRewrites");
const WebserverConfig_1 = require("polar-shared-webserver/src/webserver/WebserverConfig");
const FileRegistry_1 = require("polar-shared-webserver/src/webserver/FileRegistry");
const Webserver_1 = require("polar-shared-webserver/src/webserver/Webserver");
const ExternalNavigationBlockDelegates_1 = require("../../electron/navigation/ExternalNavigationBlockDelegates");
const log = Logger_1.Logger.create();
const WEBSERVER_PORT = 8500;
class MainApp {
    constructor(datastore) {
        this.datastore = datastore;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            MainAppExceptionHandlers_1.MainAppExceptionHandlers.register();
            ExternalNavigationBlockDelegates_1.ExternalNavigationBlockDelegates.init();
            global.datastore = this.datastore;
            const webserverConfig = WebserverConfig_1.WebserverConfigs.create({
                dir: AppPath_1.AppPath.get(),
                port: WEBSERVER_PORT,
                host: 'localhost',
                useSSL: false,
                rewrites: DefaultRewrites_1.DefaultRewrites.create()
            });
            const fileRegistry = new FileRegistry_1.FileRegistry(webserverConfig);
            const directories = new Directories_1.Directories();
            const screenshotService = new ScreenshotService_1.ScreenshotService();
            screenshotService.start();
            new RendererAnalyticsService_1.RendererAnalyticsService().start();
            yield directories.init();
            log.info("Electron app path is: " + electron_1.app.getAppPath());
            const webserver = new Webserver_1.Webserver(webserverConfig, fileRegistry);
            yield webserver.start();
            log.info("App loaded from: ", electron_1.app.getAppPath());
            log.info("Stash dir: ", directories.stashDir);
            log.info("Logs dir: ", directories.logsDir);
            const mainWindow = yield AppLauncher_1.AppLauncher.launchRepositoryApp();
            yield new DocInfoBroadcasterService_1.DocInfoBroadcasterService().start();
            log.info("Running with process.args: ", JSON.stringify(process_1.default.argv));
            const mainAppController = new MainAppController_1.MainAppController(webserver);
            global.mainAppController = mainAppController;
            const mainAppAPI = new MainAPI_1.MainAPI(mainAppController, webserver);
            mainAppAPI.start();
            const mainAppMenu = new MainAppMenu_1.MainAppMenu(mainAppController);
            mainAppMenu.setup();
            electron_1.app.on('open-file', (event, path) => __awaiter(this, void 0, void 0, function* () {
                log.info("Open file called for: ", path);
                FileImportClient_1.FileImportClient.send(FileImportRequests_1.FileImportRequests.fromPath(path));
            }));
            electron_1.app.on('second-instance', (event, commandLine) => __awaiter(this, void 0, void 0, function* () {
                log.info("Someone opened a second instance.");
                const fileArg = Cmdline_1.Cmdline.getDocArg(commandLine);
                if (fileArg) {
                    FileImportClient_1.FileImportClient.send(FileImportRequests_1.FileImportRequests.fromPath(fileArg));
                }
                else {
                    mainAppController.activateMainWindow();
                }
            }));
            electron_1.app.on('window-all-closed', function () {
                log.info("No windows left. Quitting app.");
                const forcedExit = () => {
                    try {
                        log.info("Forcing app quit...");
                        electron_1.app.quit();
                        log.info("Forcing process exit...");
                        process_1.default.exit();
                    }
                    catch (e) {
                        log.error("Unable to force exit: ", e);
                    }
                };
                const gracefulExit = () => {
                    try {
                        mainAppController.exitApp();
                    }
                    catch (e) {
                        log.error("Failed graceful exit: ", e);
                        forcedExit();
                    }
                };
                gracefulExit();
            });
            electron_1.app.on('activate', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const visibleWindows = electron_1.BrowserWindow.getAllWindows()
                        .filter(current => current.isVisible());
                    if (visibleWindows.length === 0) {
                        AppLauncher_1.AppLauncher.launchRepositoryApp()
                            .catch(err => log.error("Could not launch repository app: ", err));
                    }
                });
            });
            return { mainWindow, mainAppController };
        });
    }
}
exports.MainApp = MainApp;
//# sourceMappingURL=MainApp.js.map