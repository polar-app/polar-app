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
const TextType_1 = require("polar-shared/src/metadata/TextType");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const Assertions_1 = require("../test/Assertions");
describe('Texts', function () {
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const text = Texts_1.Texts.create("asdf", TextType_1.TextType.HTML);
            const expected = {
                "HTML": "asdf"
            };
            Assertions_1.assertJSON(text, expected);
        });
    });
    xit("toText", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const input = Texts_1.Texts.create("<p>this is <b>the</b>text</p>", TextType_1.TextType.HTML);
            const expected = {
                "HTML": "asdf"
            };
            Assertions_1.assertJSON(Texts_1.Texts.toText(input), "");
        });
    });
});
//# sourceMappingURL=TextsTest.js.map