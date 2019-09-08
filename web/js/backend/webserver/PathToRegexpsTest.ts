import {assert} from 'chai';
import {PathToRegexps} from "./PathToRegexps";

describe('PathToRegexps', function() {

        it("basic", async function() {

            assert.equal(PathToRegexps.pathToRegexp("/:foo"), "/([^/]+)");
            assert.equal(PathToRegexps.pathToRegexp("/products/:product/page/:page"), "/products/([^/]+)/page/([^/]+)");

        });

});
