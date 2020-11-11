"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UploadPaths_1 = require("./UploadPaths");
const chai_1 = require("chai");
describe('UploadPaths', function () {
    it("basic", function () {
        chai_1.assert.isUndefined(UploadPaths_1.UploadPaths.parse('/foo.txt'));
        chai_1.assert.equal(UploadPaths_1.UploadPaths.parse('/bar/foo.txt'), 'bar');
        chai_1.assert.equal(UploadPaths_1.UploadPaths.parse('bar/foo.txt'), 'bar');
        chai_1.assert.equal(UploadPaths_1.UploadPaths.parse('/bar/cat/foo.txt'), 'bar/cat');
        chai_1.assert.equal(UploadPaths_1.UploadPaths.parse('bar/cat/foo.txt'), 'bar/cat');
    });
});
//# sourceMappingURL=UploadPathsTest.js.map