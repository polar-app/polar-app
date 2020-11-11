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
const Assertions_1 = require("../../test/Assertions");
const Descriptors_1 = require("./Descriptors");
describe('Descriptors', function () {
    describe('computeScrollBoxFromBoxes', function () {
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const scrollBox = {
                    width: 150,
                    height: 150
                };
                const scroll = {
                    width: 100,
                    height: 100
                };
                let result = Descriptors_1.Descriptors.computeScrollBoxFromBoxes(scrollBox, scroll);
                chai_1.assert.ok(result.isPresent());
                Assertions_1.assertJSON(result, {
                    "value": {
                        "width": 150,
                        "height": 150
                    }
                });
            });
        });
        it("none", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let result = Descriptors_1.Descriptors.computeScrollBoxFromBoxes();
                chai_1.assert.isFalse(result.isPresent());
            });
        });
        it("first", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const scrollBox = {
                    width: 150,
                    height: 150
                };
                let result = Descriptors_1.Descriptors.computeScrollBoxFromBoxes(scrollBox);
                chai_1.assert.ok(result.isPresent());
                Assertions_1.assertJSON(result, {
                    "value": {
                        "width": 150,
                        "height": 150
                    }
                });
            });
        });
        it("last", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const scroll = {
                    width: 100,
                    height: 100
                };
                let result = Descriptors_1.Descriptors.computeScrollBoxFromBoxes(undefined, scroll);
                chai_1.assert.ok(result.isPresent());
                Assertions_1.assertJSON(result, {
                    "value": {
                        "width": 100,
                        "height": 100
                    }
                });
            });
        });
        it("broken", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const scroll = {
                    width: "100",
                    height: 100
                };
                let result = Descriptors_1.Descriptors.computeScrollBoxFromBoxes(scroll, scroll);
                chai_1.assert.isFalse(result.isPresent());
            });
        });
    });
});
//# sourceMappingURL=DescriptorsTest.js.map