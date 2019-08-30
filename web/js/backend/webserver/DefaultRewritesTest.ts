import {assert} from 'chai';
import {RewriteURLs} from "./DefaultRewrites";

describe('DefaultRewrites', function() {

    describe('RewriteURLs', function() {

        it("basic", async function() {

            assert.equal(RewriteURLs.slugToRegex("/:foo"), "/:[^/]+");
            assert.equal(RewriteURLs.slugToRegex("/products/:product/page/:page"), "/products/:[^/]+/page/:[^/]+");

        });

    });

});
