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
const MemoryDatastore_1 = require("../../js/datastore/MemoryDatastore");
const Logging_1 = require("../../js/logger/Logging");
const MainApp_1 = require("../../js/apps/main/MainApp");
const BrowserWindowRegistry_1 = require("../../js/electron/framework/BrowserWindowRegistry");
const chai_1 = require("chai");
const wait_for_expect_1 = __importDefault(require("wait-for-expect"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const AppPath_1 = require("../../js/electron/app_path/AppPath");
const log = Logger_1.Logger.create();
let polarDir;
let mainAppController;
AppPath_1.AppPath.set(FilePaths_1.FilePaths.resolve(__dirname, "..", "..", ".."));
function createWindow() {
    return __awaiter(this, void 0, void 0, function* () {
        polarDir = yield setupNewDataDir();
        const datastore = new MemoryDatastore_1.MemoryDatastore();
        yield datastore.init();
        yield Logging_1.Logging.init();
        const mainApp = new MainApp_1.MainApp(datastore);
        const mainAppState = yield mainApp.start();
        mainAppController = mainAppState.mainAppController;
        return mainAppState.mainWindow;
    });
}
SpectronMain2_1.SpectronMain2.create({ windowFactory: createWindow }).run((state) => __awaiter(void 0, void 0, void 0, function* () {
    log.info("Waiting for repository to show...");
    yield wait_for_expect_1.default(() => {
        const windows = BrowserWindowRegistry_1.BrowserWindowRegistry.tagged({ name: 'app', value: 'repository' });
        chai_1.assert.ok(windows.length === 1);
    });
    yield state.testResultWriter.write(true);
}));
function setupNewDataDir() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDir = yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.polar-main-app');
        log.info("Using new dataDir: " + dataDir);
        const stashDir = FilePaths_1.FilePaths.create(dataDir, 'stash');
        const filenames = ['example.pdf', 'example.phz'];
        const files = [];
        for (const filename of filenames) {
            const srcPath = FilePaths_1.FilePaths.join(__dirname, 'files', filename);
            const targetPath = FilePaths_1.FilePaths.join(stashDir, filename);
            yield Files_1.Files.copyFileAsync(srcPath, targetPath);
            files.push(targetPath);
        }
        return {
            files
        };
    });
}
//# sourceMappingURL=index.js.map