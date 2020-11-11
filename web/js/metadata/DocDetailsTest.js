"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DocInfos_1 = require("./DocInfos");
const DocDetails_1 = require("./DocDetails");
describe('DocDetails', function () {
    it('basic', function () {
        let docInfo = DocInfos_1.DocInfos.create('0x001', 1);
        let docDetail = {
            fingerprint: '0x001',
            title: 'hello world'
        };
        let actual = DocDetails_1.DocDetails.merge(docInfo, docDetail);
        chai_1.assert.equal(docInfo.title, 'hello world');
    });
});
//# sourceMappingURL=DocDetailsTest.js.map