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
const ModelNames_1 = require("./ModelNames");
const chai_1 = require("chai");
describe('ModelNames', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            ModelNames_1.ModelNames.verifyRequired(['Cloze', 'Basic']);
            ModelNames_1.ModelNames.verifyRequired(['Cloze', 'Basic', 'foo', 'bar']);
            chai_1.assert.throws(() => ModelNames_1.ModelNames.verifyRequired(['foo', 'bar']));
            chai_1.assert.throws(() => ModelNames_1.ModelNames.verifyRequired(['foo', 'bar', 'Cloze']));
            chai_1.assert.throws(() => ModelNames_1.ModelNames.verifyRequired(['foo', 'bar', 'Basic']));
        });
    });
});
//# sourceMappingURL=ModelNamesTest.js.map