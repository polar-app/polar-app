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
const BufferWriter_1 = require("./BufferWriter");
const chai_1 = require("chai");
describe('BufferWriter', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = new BufferWriter_1.BufferWriter();
            yield writer.write("hello");
            yield writer.write("world");
            yield writer.close();
            chai_1.assert.equal(writer.toString(), "helloworld");
        });
    });
    it("no data", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = new BufferWriter_1.BufferWriter();
            yield writer.close();
            chai_1.assert.equal(writer.toString(), "");
        });
    });
    it("one write", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = new BufferWriter_1.BufferWriter();
            yield writer.write("hello");
            yield writer.close();
            chai_1.assert.equal(writer.toString(), "hello");
        });
    });
});
//# sourceMappingURL=BufferWriterTest.js.map