import {assert} from 'chai';
import {DocInfos} from 'polar-shared/src/metadata/DocInfos';
import {DocDetail} from './DocDetail';
import {DocDetails} from './DocDetails';

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
