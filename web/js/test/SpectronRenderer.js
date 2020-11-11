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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpectronRendererState = exports.SpectronRenderer = void 0;
const electron_1 = require("electron");
const TestResultService_1 = require("./results/TestResultService");
const RendererTestResultWriter_1 = require("./results/writer/RendererTestResultWriter");
class SpectronRenderer {
    static setup() {
        new TestResultService_1.TestResultService().start();
    }
    static start(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            SpectronRenderer.setup();
            const state = new SpectronRendererState();
            const result = yield callback(state);
            electron_1.ipcRenderer.send('spectron-renderer-started', true);
            return result;
        });
    }
    static run(callback) {
        this.start(callback)
            .catch(err => console.error(err));
    }
}
exports.SpectronRenderer = SpectronRenderer;
class SpectronRendererState {
    get testResultWriter() {
        return new RendererTestResultWriter_1.RendererTestResultWriter();
    }
}
exports.SpectronRendererState = SpectronRendererState;
//# sourceMappingURL=SpectronRenderer.js.map