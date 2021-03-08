import {assert} from 'chai';
import {GroupSlugs} from './GroupSlugs';

describe('GroupSlugs', function() {

    it("basic", async function() {

        function assertFailure(name: string) {
            try {
                GroupSlugs.create(name);
                assert.fail("We should not accept this: " + name);
            } catch (e) {
                // noop
            }
        }

        assertFailure(" hello world");
        assertFailure("#hello");
        assertFailure("foo/bar");
        assertFailure("foo:bar");


    });

});
