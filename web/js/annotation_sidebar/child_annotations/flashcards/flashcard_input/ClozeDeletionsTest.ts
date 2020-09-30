import {assert} from 'chai';
import {ClozeDeletions} from './ClozeDeletions';
import {assertJSON} from "../../../../test/Assertions";

describe('ClozeDeletions', function() {

    it("basic", function() {
        assertJSON(ClozeDeletions.parse(""), []);
        assertJSON(ClozeDeletions.parse("{{c1::1913}}"), [1]);
        assertJSON(ClozeDeletions.parse("{{c1::1913}} {{c2::1913}}"), [1, 2]);
        assertJSON(ClozeDeletions.parse("{{c1::1913}} {{c99::1913}}"), [1, 99]);
    });

    it("next", function() {
        assert.equal(ClozeDeletions.next(""), 1);
        assert.equal(ClozeDeletions.next("{{c1::1913}}"), 2);
        assert.equal(ClozeDeletions.next("{{c1::1913}} {{c2::1913}}"), 3);
        assert.equal(ClozeDeletions.next("{{c1::1913}} {{c99::1913}}"), 100);
    });

});
