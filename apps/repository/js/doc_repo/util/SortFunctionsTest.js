"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SortFunctions_1 = require("./SortFunctions");
const Assertions_1 = require("../../../../../web/js/test/Assertions");
describe('SortFunctions', function () {
    it("basic", function () {
        const sorted = ['', '', 'cat', 'bar']
            .sort((a, b) => SortFunctions_1.SortFunctions.compareWithEmptyStringsLast(a, b, (value) => value));
        Assertions_1.assertJSON(sorted, ["bar", "cat", "", ""]);
    });
});
//# sourceMappingURL=SortFunctionsTest.js.map