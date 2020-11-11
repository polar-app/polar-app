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
exports.Spectron = void 0;
const electron_1 = __importDefault(require("electron"));
const SpectronOutputMonitorService_1 = require("./SpectronOutputMonitorService");
const Logger_1 = require("polar-shared/src/logger/Logger");
const { Application } = require('spectron');
const log = Logger_1.Logger.create();
const TIMEOUT = 600000;
const ELECTRON_PATH = electron_1.default;
class Spectron {
    static setup(dir, ...args) {
        console.log("Configuring spectron...");
        let spectronOutputMonitorService;
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function* () {
                this.timeout(TIMEOUT);
                console.log("Starting spectron with dir: " + dir);
                console.log("ELECTRON_PATH ", ELECTRON_PATH);
                this.app = new Application({
                    path: ELECTRON_PATH,
                    args: [dir, ...args],
                    startTimeout: TIMEOUT,
                    waitTimeout: TIMEOUT
                });
                console.log("Starting app...");
                const app = yield this.app.start();
                console.log("Starting app...done");
                spectronOutputMonitorService = new SpectronOutputMonitorService_1.SpectronOutputMonitorService(app);
                spectronOutputMonitorService.start();
                return app;
            });
        });
        afterEach(function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Going to shutdown now... ");
                if (spectronOutputMonitorService) {
                    spectronOutputMonitorService.stop();
                    spectronOutputMonitorService.doLogForwarding();
                }
                if (this.app && this.app.isRunning()) {
                    return this.app.stop();
                }
                else {
                    console.log("App already stopped.");
                }
            });
        });
    }
    static run(callback) {
    }
}
exports.Spectron = Spectron;
//# sourceMappingURL=Spectron.js.map