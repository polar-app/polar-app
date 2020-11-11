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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const Logging_1 = require("../../js/logger/Logging");
const MainApp_1 = require("../../js/apps/main/MainApp");
const BrowserWindowRegistry_1 = require("../../js/electron/framework/BrowserWindowRegistry");
const chai_1 = require("chai");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const FileImportClient_1 = require("../../js/apps/repository/FileImportClient");
const Files_1 = require("polar-shared/src/util/Files");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const DiskDatastore_1 = require("../../js/datastore/DiskDatastore");
const AppInstances_1 = require("../../js/electron/framework/AppInstances");
const AppPath_1 = require("../../js/electron/app_path/AppPath");
const FileImportRequests_1 = require("../../js/apps/repository/FileImportRequests");
const log = Logger_1.Logger.create();
AppPath_1.AppPath.set(FilePaths_1.FilePaths.resolve(__dirname, "..", "..", ".."));
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.polar-main-app-with-import');
        const datastore = new DiskDatastore_1.DiskDatastore();
        yield datastore.init();
        yield Logging_1.Logging.init();
        const mainApp = new MainApp_1.MainApp(datastore);
        const mainAppState = yield mainApp.start();
        return mainAppState.mainWindow;
    });
}
SpectronMain2_1.SpectronMain2.create({ windowFactory: createWindow }).run((state) => __awaiter(void 0, void 0, void 0, function* () {
    log.info("Waiting for repository to show...");
    log.info("Waiting for repository app...");
    yield wait_for_expect_1.default(() => {
        const windows = BrowserWindowRegistry_1.BrowserWindowRegistry.tagged({ name: 'app', value: 'repository' });
        chai_1.assert.ok(windows.length === 1, "wrong number of windows");
    });
    log.info("Waiting for repository app...done");
    const rawPath = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..", "docs", "example.pdf");
    const importFilePath = yield Files_1.Files.realpathAsync(rawPath);
    chai_1.assert.ok(yield Files_1.Files.existsAsync(importFilePath), "file does not exist: " + importFilePath);
    const files = [
        importFilePath
    ];
    yield AppInstances_1.AppInstances.waitForStarted('RepositoryApp');
    log.info("Sending file import client request...");
    FileImportClient_1.FileImportClient.send(FileImportRequests_1.FileImportRequests.fromPaths(files));
    log.info("Trying to find viewer...");
    yield wait_for_expect_1.default(() => {
        const windows = BrowserWindowRegistry_1.BrowserWindowRegistry.tagged({ name: 'type', value: 'viewer' });
        chai_1.assert.ok(windows.length > 0, "wrong number of windows ");
    });
    log.info("Trying to find viewer...done");
    const pdfStashPath = FilePaths_1.FilePaths.join(PolarDataDir_1.PolarDataDir.get(), "stash", "12i77BKrNy-example.pdf");
    log.info("Testing for file: " + pdfStashPath);
    chai_1.assert.ok(yield Files_1.Files.existsAsync(pdfStashPath), "File does not exist: " + pdfStashPath);
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=index.js.map