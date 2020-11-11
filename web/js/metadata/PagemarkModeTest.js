"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const PagemarkModes_1 = require("./PagemarkModes");
describe('PagemarkMode', function () {
    it("toDescriptors", function () {
        const expected = [
            {
                "name": "PRE_READ",
                "title": "pre read",
                "key": "pre-read"
            },
            {
                "name": "READ",
                "title": "read",
                "key": "read"
            },
            {
                "name": "IGNORED",
                "title": "ignored",
                "key": "ignored"
            },
            {
                "name": "TABLE_OF_CONTENTS",
                "title": "table of contents",
                "key": "table-of-contents"
            },
            {
                "name": "APPENDIX",
                "title": "appendix",
                "key": "appendix"
            },
            {
                "name": "REFERENCES",
                "title": "references",
                "key": "references"
            }
        ];
        Assertions_1.assertJSON(PagemarkModes_1.PagemarkModes.toDescriptors(), expected);
    });
});
//# sourceMappingURL=PagemarkModeTest.js.map