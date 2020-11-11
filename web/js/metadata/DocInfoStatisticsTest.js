"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const DocMetas_1 = require("./DocMetas");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const DocInfoStatistics_1 = require("./DocInfoStatistics");
describe('DocInfoStatistics', function () {
    describe('computeDocumentsAddedRate', function () {
        it("basic", function () {
            TestingTime_1.TestingTime.freeze();
            const docInfos = [];
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x001').docInfo);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x002').docInfo);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x003').docInfo);
            TestingTime_1.TestingTime.forward(24 * 60 * 60 * 1000);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x004').docInfo);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x005').docInfo);
            TestingTime_1.TestingTime.forward(24 * 60 * 60 * 1000);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x006').docInfo);
            docInfos.push(DocMetas_1.MockDocMetas.createMockDocMeta('0x007').docInfo);
            const dateStats = DocInfoStatistics_1.DocInfoStatistics.computeDocumentsAddedRate(docInfos);
            Assertions_1.assertJSON(dateStats, [
                {
                    "date": "2012-03-02",
                    "value": 3
                },
                {
                    "date": "2012-03-03",
                    "value": 2
                },
                {
                    "date": "2012-03-04",
                    "value": 2
                }
            ]);
        });
    });
});
//# sourceMappingURL=DocInfoStatisticsTest.js.map