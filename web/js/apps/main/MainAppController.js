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
exports.MainAppController = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Services_1 = require("../../util/services/Services");
const MainAppBrowserWindowFactory_1 = require("./MainAppBrowserWindowFactory");
const AppLauncher_1 = require("./AppLauncher");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const SingletonBrowserWindow_1 = require("../../electron/framework/SingletonBrowserWindow");
const process_1 = __importDefault(require("process"));
const Directories_1 = require("../../datastore/Directories");
const FileImportClient_1 = require("../repository/FileImportClient");
const MainAppExceptionHandlers_1 = require("./MainAppExceptionHandlers");
const FileImportRequests_1 = require("../repository/FileImportRequests");
const log = Logger_1.Logger.create();
class MainAppController {
    constructor(webserver) {
        this.webserver = webserver;
        this.directories = new Directories_1.Directories();
    }
    cmdImport() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.promptImportDocs();
            if (files) {
                const fileImportRequests = FileImportRequests_1.FileImportRequests.fromPaths(files);
                FileImportClient_1.FileImportClient.send(fileImportRequests);
            }
        });
    }
    cmdExit() {
        this.exitApp();
    }
    cmdToggleDevTools(item, focusedWindow) {
        log.info("Toggling dev tools in: " + focusedWindow);
        focusedWindow.webContents.toggleDevTools();
    }
    exitApp() {
        const doProcessExit = true;
        const doAppQuit = true;
        const doServicesStop = true;
        const doWindowGC = false;
        const doCloseWindows = false;
        const doDestroyWindows = false;
        MainAppExceptionHandlers_1.MainAppExceptionHandlers.register();
        log.info("Exiting app...");
        if (doWindowGC) {
            log.info("Getting all browser windows...");
            const browserWindows = electron_1.BrowserWindow.getAllWindows();
            log.info("Getting all browser windows...done");
            log.info("Closing/destroying all windows...");
            for (const browserWindow of browserWindows) {
                const id = browserWindow.id;
                if (!browserWindow.isDestroyed()) {
                    if (doCloseWindows && browserWindow.isClosable()) {
                        log.info(`Closing window id=${id}`);
                        browserWindow.close();
                    }
                    if (doDestroyWindows) {
                        log.info(`Destroying window id=${id}`);
                        browserWindow.destroy();
                    }
                }
                else {
                    log.info(`Skipping destroy window (is destroyed) id=${id}`);
                }
            }
            log.info("Closing/destroying all windows...done");
        }
        if (doServicesStop) {
            log.info("Stopping services...");
            Services_1.Services.stop({
                webserver: this.webserver,
            });
            log.info("Stopping services...done");
        }
        if (doAppQuit) {
            log.info("Quitting app...");
            electron_1.app.quit();
            log.info("Quitting app...done");
        }
        if (doProcessExit) {
            log.info("Process exit...");
            process_1.default.exit();
            log.info("Process exit...done");
        }
    }
    handleLoadDoc(url, newWindow = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const extraTags = { 'type': 'viewer' };
            const browserWindowTag = { name: 'viewer', value: Hashcodes_1.Hashcodes.createID(url) };
            return yield SingletonBrowserWindow_1.SingletonBrowserWindow.getInstance(browserWindowTag, () => __awaiter(this, void 0, void 0, function* () {
                const computeWindow = () => __awaiter(this, void 0, void 0, function* () {
                    const createWindow = () => __awaiter(this, void 0, void 0, function* () {
                        return yield MainAppBrowserWindowFactory_1.MainAppBrowserWindowFactory.createWindow(MainAppBrowserWindowFactory_1.BROWSER_WINDOW_OPTIONS, url);
                    });
                    if (newWindow) {
                        return createWindow();
                    }
                    const focusedWindow = electron_1.BrowserWindow.getFocusedWindow();
                    if (focusedWindow) {
                        return focusedWindow;
                    }
                    else {
                        return yield createWindow();
                    }
                });
                return yield computeWindow();
            }), extraTags);
        });
    }
    activateMainWindow() {
        let browserWindows = electron_1.BrowserWindow.getAllWindows();
        browserWindows = browserWindows.filter(browserWindow => browserWindow.isVisible());
        if (browserWindows.length === 0) {
            AppLauncher_1.AppLauncher.launchRepositoryApp()
                .catch(err => log.error("Unable to open repository app: ", err));
            return;
        }
        const mainWindow = browserWindows[0];
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
    promptImportDocs() {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadsDir = electron_1.app.getPath('downloads');
            const openedDialog = yield electron_1.dialog.showOpenDialog({
                title: "Import Document",
                defaultPath: downloadsDir,
                filters: [
                    { name: 'Docs', extensions: ['pdf', "PDF", 'epub', 'EPUB'] }
                ],
                properties: ['openFile', 'multiSelections']
            });
            if (openedDialog.canceled) {
                return undefined;
            }
            return openedDialog.filePaths;
        });
    }
}
exports.MainAppController = MainAppController;
//# sourceMappingURL=MainAppController.js.map