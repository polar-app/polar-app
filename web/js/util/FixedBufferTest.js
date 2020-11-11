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
const chai_1 = require("chai");
const FixedBuffer_1 = require("./FixedBuffer");
describe('FixedBuffer', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = new FixedBuffer_1.FixedBuffer(2);
            const toText = () => {
                return buffer.toView().join("\n");
            };
            chai_1.assert.equal(toText(), "");
            buffer.write("0");
            chai_1.assert.equal(toText(), "0");
            buffer.write("1");
            chai_1.assert.equal(toText(), "0\n1");
            buffer.write("2");
            chai_1.assert.equal(toText(), "1\n2");
        });
    });
});
//# sourceMappingURL=FixedBufferTest.js.map