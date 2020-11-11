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
exports.SpectronSpec = void 0;
const chai_1 = require("chai");
const WebDriverTestResultReader_1 = require("./results/reader/WebDriverTestResultReader");
const Concurrently_1 = require("../util/Concurrently");
class SpectronSpec {
    constructor(app) {
        this.app = app;
    }
    waitFor(val) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Concurrently_1.Concurrently.waitForPredicate(() => this.app.client.getWindowCount(), (windowCount) => windowCount >= 1);
            const testResultReader = new WebDriverTestResultReader_1.WebDriverTestResultReader(this.app);
            chai_1.assert.equal(yield testResultReader.read(), val);
            return this;
        });
    }
    static create(app) {
        return new SpectronSpec(app);
    }
    stop() {
        this.app.stop();
    }
}
exports.SpectronSpec = SpectronSpec;
//# sourceMappingURL=SpectronSpec.js.map