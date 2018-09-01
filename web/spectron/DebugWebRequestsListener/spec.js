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
const WebDriverTestResultReader_1 = require("../../js/test/results/reader/WebDriverTestResultReader");
const assert = require('assert');
const { assertJSON } = require("../../js/test/Assertions");
const { Spectron } = require("../../js/test/Spectron");
const electronPath = require('electron');
const path = require('path');
const { Files } = require("../../js/util/Files.js");
describe('DebugWebRequestsListener', function () {
    this.timeout(10000);
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            let logsDir = "/tmp/DebugWebRequestsListener";
            yield Files.createDirAsync(logsDir);
            yield Files.removeAsync(logsDir + "/polar.log");
        });
    });
    Spectron.setup(__dirname);
    xit('Make sure they are written to the log.', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert.equal(yield this.app.client.getWindowCount(), 1);
            let testResultReader = new WebDriverTestResultReader_1.WebDriverTestResultReader(this.app);
            assert.equal(yield testResultReader.read(), true);
            return true;
        });
    });
});
//# sourceMappingURL=spec.js.map