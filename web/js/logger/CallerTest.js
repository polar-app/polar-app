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
const { Caller } = require('./Caller');
describe('Caller', function () {
    describe('Test basic caller', () => {
        it("call method and to make sure we get the right caller", function () {
            return __awaiter(this, void 0, void 0, function* () {
                assert_1.default.deepEqual(myCaller(), { filename: "CallerTest.js" });
            });
        });
    });
    describe('__parse', () => {
        it("Parse a basic frame", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let frame = "     at Function.getCaller (/home/burton/projects/polar-bookshelf/web/js/test/MyTest.js:5:17)";
                assert_1.default.deepEqual(Caller._parse(frame), { filename: "MyTest.js" });
            });
        });
        it("Parse a webpack frame", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let frame = "    at Object../web/js/metadata/Pagemarks.js (http://127.0.0.1:8500/web/dist/electron-bundle.js:59471:86)\n";
                assert_1.default.deepEqual(Caller._parse(frame), { filename: "Pagemarks.js" });
            });
        });
        it("Parse a webpack frame with a question mark at the end", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let frame = "    at eval (webpack:///./web/js/metadata/Pagemarks.js?:11:86)\n";
                assert_1.default.deepEqual(Caller._parse(frame), { filename: "Pagemarks.js" });
            });
        });
    });
});
function myCaller() {
    return Caller.getCaller();
}
//# sourceMappingURL=CallerTest.js.map