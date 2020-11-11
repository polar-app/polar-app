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
const Fingerprints_1 = require("./Fingerprints");
const chai_1 = require("chai");
describe('Fingerprints', function () {
    it("toFilename", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Fingerprints_1.Fingerprints.toFilename("hello.chtml", "0x0001"), "hello-0x0001.chtml");
        });
    });
    it("fromFilename", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Fingerprints_1.Fingerprints.fromFilename("hello-0x0001.chtml"), "0x0001");
        });
    });
    it("create", function () {
        return __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.equal(Fingerprints_1.Fingerprints.create("xxxxx"), "1Ufomfbkk3Js2YGDZr4c");
        });
    });
});
//# sourceMappingURL=FingerprintsTest.js.map