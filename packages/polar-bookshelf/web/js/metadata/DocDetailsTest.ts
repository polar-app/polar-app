
import {assert} from 'chai';

import {DocInfo} from './DocInfo';
import {DocInfos} from './DocInfos';
import {DocDetail} from './DocDetail';
import {DocDetails} from './DocDetails';
import {assertJSON} from '../test/Assertions';

describe('DocDetails', function () {

    it('basic', function () {

        let docInfo = DocInfos.create('0x001', 1);

        let docDetail: DocDetail = {
            fingerprint: '0x001',
            title: 'hello world'
        };

        let actual = DocDetails.merge(docInfo, docDetail)
        assert.equal(docInfo.title, 'hello world');

        //assertJSON(, {});

    });

});
