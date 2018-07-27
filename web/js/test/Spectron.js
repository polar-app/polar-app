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
const SpectronOutputMonitorService_1 = require("./SpectronOutputMonitorService");
const { Application } = require('spectron');
const electronPath = require('electron');
class Spectron {
    static setup(dir, ...args) {
        console.log("Configuring spectron...");
        let spectronOutputMonitorService;
        beforeEach(function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("Starting spectron with dir: " + dir);
                this.app = new Application({
                    path: electronPath,
                    args: [dir, ...args]
                });
                console.log("Starting app...");
                let app = yield this.app.start();
                console.log("Starting app...done");
                spectronOutputMonitorService = new SpectronOutputMonitorService_1.SpectronOutputMonitorService(app);
                spectronOutputMonitorService.start();
                return app;
            });
        });
        afterEach(function () {
            console.log("Going to shutdown now... ");
            if (spectronOutputMonitorService) {
                spectronOutputMonitorService.stop();
                spectronOutputMonitorService._doLogForwarding();
            }
            if (this.app && this.app.isRunning()) {
                console.log("Telling app to stop");
                return this.app.stop();
            }
            else {
                console.log("App already stopped.");
            }
        });
    }
    static run(callback) {
    }
}
exports.Spectron = Spectron;
//# sourceMappingURL=Spectron.js.map