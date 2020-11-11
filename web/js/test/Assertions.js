"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = exports.assertJSON = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const chai_1 = __importDefault(require("chai"));
const assert = chai_1.default.assert;
const expect = chai_1.default.expect;
chai_1.default.config.truncateThreshold = 0;
function assertJSON(actual, expected, message, unsorted) {
    actual = toJSON(actual, unsorted);
    expected = toJSON(expected, unsorted);
    if (actual !== expected) {
        console.error("BEGIN ACTUAL ==========");
        console.error(actual);
        console.error("END ACTUAL   ==========");
    }
    try {
        expect(actual).equal(expected, message);
    }
    catch (e) {
        console.error(e.message);
        throw e;
    }
}
exports.assertJSON = assertJSON;
function toJSON(obj, unsorted = false) {
    if (typeof obj === "string") {
        obj = JSON.parse(obj);
    }
    const replacer = (key, value) => {
        if (typeof value === 'object' && value instanceof Set) {
            return [...value];
        }
        return value;
    };
    if (!Array.isArray(obj) && !unsorted) {
        obj = Dictionaries_1.Dictionaries.sorted(obj);
    }
    return JSON.stringify(obj, replacer, "  ");
}
exports.toJSON = toJSON;
//# sourceMappingURL=Assertions.js.map