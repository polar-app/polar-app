"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagMatcherFactory = exports.TagMatcher = void 0;
const Tags_1 = require("polar-shared/src/tags/Tags");
const TagPaths_1 = require("./TagPaths");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
class TagMatcher {
    constructor(queryTagPairs, docTags) {
        this.queryTagPairs = queryTagPairs;
        this.docTags = docTags;
        this.docTagPairs = new TagPairs(this.docTags);
    }
    matches() {
        return this.matchesFolders() && this.matchesTags();
    }
    matchesFolders() {
        const queryTagIDs = this.queryTagPairs.folderTags.tagIDs;
        const docTagIDs = this.docTagPairs.folderTags.tagIDs;
        if (queryTagIDs.length === 0) {
            return true;
        }
        const index = {};
        for (const docTagID of docTagIDs) {
            const pathEntries = TagPaths_1.TagPaths.createPathEntries(docTagID);
            for (const pathEntry of pathEntries) {
                index[pathEntry.path] = true;
            }
        }
        for (const queryTagID of queryTagIDs) {
            if (index[queryTagID]) {
                return true;
            }
        }
        return false;
    }
    matchesTags() {
        const queryTagIDs = this.queryTagPairs.regularTags.tagIDs;
        const docTagIDs = this.docTagPairs.regularTags.tagIDs;
        if (queryTagIDs.length === 0) {
            return true;
        }
        if (docTagIDs.length === 0) {
            return false;
        }
        const intersection = SetArrays_1.SetArrays.intersection(queryTagIDs, docTagIDs);
        return intersection.length === queryTagIDs.length;
    }
}
exports.TagMatcher = TagMatcher;
class TagPairs {
    constructor(tags) {
        this.tags = tags;
        this.folderTags = new FolderTags(Tags_1.Tags.onlyFolderTags(this.tags));
        this.regularTags = new FolderTags(Tags_1.Tags.onlyRegular(this.tags));
    }
}
class TypedTags {
    constructor(tags) {
        this.tags = tags;
        this.tagIDs = Tags_1.Tags.toIDs(this.tags);
    }
}
class FolderTags extends TypedTags {
    constructor(tags) {
        super(tags);
    }
}
class RegularTags extends TypedTags {
}
class TagMatcherFactory {
    constructor(queryTags) {
        this.queryTags = queryTags;
        this.queryTagPairs = new TagPairs(this.queryTags);
    }
    create(docTags) {
        return new TagMatcher(this.queryTagPairs, docTags);
    }
    filter(list, toTags) {
        return list.filter(current => {
            const tags = toTags(current);
            const tagMatcher = this.create(tags);
            return tagMatcher.matches();
        });
    }
}
exports.TagMatcherFactory = TagMatcherFactory;
//# sourceMappingURL=TagMatcher.js.map