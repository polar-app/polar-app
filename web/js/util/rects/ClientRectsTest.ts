import {assert} from 'chai';
import {ClientRects} from './ClientRects';

describe('ClientRects', function() {

    it("basic", function () {

        let clientRect = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };

        assert.equal(ClientRects.instanceOf(clientRect), true);

    });

});
