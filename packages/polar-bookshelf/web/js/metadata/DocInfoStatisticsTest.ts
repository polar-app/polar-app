import {assertJSON} from '../test/Assertions';
import {MockDocMetas} from './DocMetas';
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {DocInfoStatistics} from './DocInfoStatistics';

describe('DocInfoStatistics', function() {

    describe('computeDocumentsAddedRate', function() {

        it("basic", function() {

            TestingTime.freeze();

            const docInfos = [];

            docInfos.push(MockDocMetas.createMockDocMeta('0x001').docInfo);
            docInfos.push(MockDocMetas.createMockDocMeta('0x002').docInfo);
            docInfos.push(MockDocMetas.createMockDocMeta('0x003').docInfo);

            TestingTime.forward(24 * 60 * 60 * 1000);
            docInfos.push(MockDocMetas.createMockDocMeta('0x004').docInfo);
            docInfos.push(MockDocMetas.createMockDocMeta('0x005').docInfo);

            TestingTime.forward(24 * 60 * 60 * 1000);
            docInfos.push(MockDocMetas.createMockDocMeta('0x006').docInfo);
            docInfos.push(MockDocMetas.createMockDocMeta('0x007').docInfo);

            const dateStats = DocInfoStatistics.computeDocumentsAddedRate(docInfos);

            assertJSON(dateStats, [
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
