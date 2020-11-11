"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Tags_1 = require("polar-shared/src/tags/Tags");
const TagMatcher_1 = require("./TagMatcher");
function createTags(...tags) {
    return tags.map(current => Tags_1.Tags.create(current));
}
function runMatcher(queryTagStrs, docTagsStrs) {
    const queryTags = createTags(...queryTagStrs);
    const docTags = createTags(...docTagsStrs);
    const tagMatcherFactory = new TagMatcher_1.TagMatcherFactory(queryTags);
    const tagMatcher = tagMatcherFactory.create(docTags);
    return tagMatcher.matches();
}
describe('TagMatcher', function () {
    it("basic matching folder", function () {
        chai_1.assert.equal(runMatcher(['/foo'], ['/foo/bar']), true);
    });
    it("basic matching tag", function () {
        chai_1.assert.equal(runMatcher(['linux'], ['linux']), true);
    });
    it("folder and tags", function () {
        chai_1.assert.equal(runMatcher(['/foo', 'linux'], ['/foo/bar', 'linux']), true);
    });
});
//# sourceMappingURL=TagMatcherTest.js.map