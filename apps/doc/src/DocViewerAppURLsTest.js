"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocViewerAppURLs_1 = require("./DocViewerAppURLs");
const Assertions_1 = require("../../../web/js/test/Assertions");
describe('DocViewerAppURLs', function () {
    it("basic", function () {
        Assertions_1.assertJSON(DocViewerAppURLs_1.DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089#15DzSGGmoW"), {
            "id": "fdaeb192dba44afb4933a6e22b4f5089"
        });
        Assertions_1.assertJSON(DocViewerAppURLs_1.DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089"), {
            "id": "fdaeb192dba44afb4933a6e22b4f5089"
        });
        Assertions_1.assertJSON(DocViewerAppURLs_1.DocViewerAppURLs.parse("http://localhost:8050/doc/fdaeb192dba44afb4933a6e22b4f5089#"), {
            "id": "fdaeb192dba44afb4933a6e22b4f5089"
        });
    });
});
//# sourceMappingURL=DocViewerAppURLsTest.js.map