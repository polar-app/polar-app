import {assert} from 'chai';
import {RewriteURLs} from "./DefaultRewrites";
import {Rewrites} from "./Rewrites";

describe('RewritesTest', function() {

    it("basic", async function() {

        assert.equal(Rewrites.matchesRegex(RewriteURLs.slugToRegex("/product/:product"), "/product/windows"), true);

    });

});
