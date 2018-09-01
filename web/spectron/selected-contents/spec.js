"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Spectron_1 = require("../../js/test/Spectron");
const TIMEOUT = 10000;
describe('SelectContents of HTML entities.', function () {
    this.timeout(TIMEOUT);
    Spectron_1.Spectron.setup(__dirname);
    xit('Test of select contents... ', function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default.equal(yield this.app.client.getWindowCount(), 1);
            let webContents = this.app.webContents;
            assert_1.default.ok(webContents);
            assert_1.default.ok(webContents.executeJavaScript);
            let executed = yield this.app.client.execute(`return testFunction();`);
        });
    });
});
//# sourceMappingURL=spec.js.map