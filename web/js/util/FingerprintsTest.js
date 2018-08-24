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
const Fingerprints_1 = require("./Fingerprints");
const assert_1 = __importDefault(require("assert"));
describe('Fingerprints', function () {
    it("toFilename", function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default.equal(Fingerprints_1.Fingerprints.toFilename("hello.chtml", "0x0001"), "hello-0x0001.chtml");
        });
    });
    it("fromFilename", function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default.equal(Fingerprints_1.Fingerprints.fromFilename("hello-0x0001.chtml"), "0x0001");
        });
    });
    it("create", function () {
        return __awaiter(this, void 0, void 0, function* () {
            assert_1.default.equal(Fingerprints_1.Fingerprints.create("xxxxx"), "1Ufomfbkk3Js2YGDZr4c");
        });
    });
});
//# sourceMappingURL=FingerprintsTest.js.map