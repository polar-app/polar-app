import {assert} from 'chai';
import {ArchiveTimestamps} from "./ArchiveTimestamps";
import {getSourceFile} from "tslint";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Arrays} from "polar-shared/src/util/Arrays";

describe('ArchiveTimestamps', function() {

    it("basic", function () {
        const timestamp = "2019-01-01T00:00:00Z";
        const timestamps = ArchiveTimestamps.create(timestamp, 24 * 60 * 60 * 1000, 365);

        // assert.equal(timestamps[364], '20191231');


        assert.equal(timestamps[0].yymmdd, '20190101');
        assert.equal(timestamps[0].iso, '2019-01-01T00:00:00.000Z');

        assert.equal(timestamps[364].yymmdd, '20191231');

        //
        // assertJSON(Arrays.head(timestamps, 30), [
        //
        // ])

        console.log(timestamps);


    });


});
