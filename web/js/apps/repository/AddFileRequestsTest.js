"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../../test/Assertions");
const AddFileRequests_1 = require("./AddFileRequests");
describe('AddFileRequests', function () {
    it('with encoded URL', function () {
        const url = "https://us-central1-polar-cors.cloudfunctions.net/cors?url=http%3A%2F%2Fwww.seanriddle.com%2Ffurbysource.pdf";
        const actual = AddFileRequests_1.AddFileRequests.fromURL(url);
        Assertions_1.assertJSON(actual, {
            "basename": "furbysource.pdf",
            "docPath": "https://us-central1-polar-cors.cloudfunctions.net/cors?url=http%3A%2F%2Fwww.seanriddle.com%2Ffurbysource.pdf"
        });
    });
    xit('windows share path', function () {
        const url = "\\\\foo\\foo$\\cat\dog";
        const actual = AddFileRequests_1.AddFileRequests.fromURL(url);
        Assertions_1.assertJSON(actual, {
            "basename": "furbysource.pdf",
            "docPath": "https://us-central1-polar-cors.cloudfunctions.net/cors?url=http%3A%2F%2Fwww.seanriddle.com%2Ffurbysource.pdf"
        });
    });
    it('with basic URL', function () {
        const url = "https://example.com/furbysource.pdf";
        const actual = AddFileRequests_1.AddFileRequests.fromURL(url);
        Assertions_1.assertJSON(actual, {
            "basename": "furbysource.pdf",
            "docPath": "https://example.com/furbysource.pdf"
        });
    });
});
//# sourceMappingURL=AddFileRequestsTest.js.map