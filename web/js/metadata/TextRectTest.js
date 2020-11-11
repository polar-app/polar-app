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
const TextRect_1 = require("./TextRect");
const Assertions_1 = require("../test/Assertions");
describe('TextRect', function () {
    describe('Object as constructor', function () {
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let textRect = new TextRect_1.TextRect({
                    rect: {
                        left: 438.66666666666663,
                        top: 782.6666666666666,
                        width: 302.7884333333333,
                        height: 11.333333333333332,
                        right: 741.4550999999999,
                        bottom: 794
                    },
                    text: "hello world"
                });
                let expected = {
                    "text": "hello world",
                    "rect": {
                        "left": 438.66666666666663,
                        "top": 782.6666666666666,
                        "width": 302.7884333333333,
                        "height": 11.333333333333332,
                        "right": 741.4550999999999,
                        "bottom": 794
                    }
                };
                Assertions_1.assertJSON(textRect, expected);
            });
        });
    });
});
//# sourceMappingURL=TextRectTest.js.map