"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Filenames_1 = require("./Filenames");
describe('Filenames', function () {
    describe('sanitize', function () {
        it("basic", function () {
            chai_1.assert.equal(Filenames_1.Filenames.sanitize("Hello!(@#&^!~)world99"), "Hello_________world99");
        });
    });
});
//# sourceMappingURL=FilenamesTest.js.map