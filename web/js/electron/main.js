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
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const MainApp_1 = require("../apps/main/MainApp");
const Logging_1 = require("../logger/Logging");
const Datastores_1 = require("../datastore/Datastores");
const process_1 = __importDefault(require("process"));
const LazyWriteDatastore_1 = require("../datastore/LazyWriteDatastore");
const Version_1 = require("polar-shared/src/util/Version");
const hasSingleInstanceLock = electron_1.app.requestSingleInstanceLock();
if (process_1.default.env.POLAR_DISABLE_HARDWARE_ACCELERATION === 'true') {
    console.log("Disabling hardware acceleration");
    electron_1.app.disableHardwareAcceleration();
}
if (!hasSingleInstanceLock) {
    console.error("Quiting.  App is single instance.");
    electron_1.app.quit();
}
electron_1.app.commandLine.appendSwitch('disable-site-isolation-trials');
function launch() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Running with CWD: " + process_1.default.cwd());
        console.log("Running with Node version: " + process_1.default.version);
        console.log("Running with Electron version: " + process_1.default.versions.electron);
        console.log("Running with Polar version: " + Version_1.Version.get());
        console.log("Running with app version: " + electron_1.app.getVersion());
        const log = Logger_1.Logger.create();
        const datastore = new LazyWriteDatastore_1.LazyWriteDatastore(Datastores_1.Datastores.create());
        yield datastore.init();
        yield Logging_1.Logging.init();
        const mainApp = new MainApp_1.MainApp(datastore);
        const { mainAppController } = yield mainApp.start();
    });
}
electron_1.app.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    const configureReactDevTools = () => {
        const path = process_1.default.env.POLAR_REACT_DEV_TOOLS;
        if (path) {
            console.log("Enabling react dev tools");
            electron_1.BrowserWindow.addDevToolsExtension(path);
        }
    };
    configureReactDevTools();
    launch().catch(err => console.error("Unable to launch app: ", err));
}));
//# sourceMappingURL=main.js.map