"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoFilters2 = void 0;
const RepoDocInfos_1 = require("../RepoDocInfos");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Strings_1 = require("polar-shared/src/util/Strings");
const TagMatcher2_1 = require("../../../../web/js/tags/TagMatcher2");
var DocRepoFilters2;
(function (DocRepoFilters2) {
    function execute(repoDocInfos, filter) {
        repoDocInfos = doFilterValid(repoDocInfos, filter);
        repoDocInfos = doFilterByTitle(repoDocInfos, filter);
        repoDocInfos = doFilterFlagged(repoDocInfos, filter);
        repoDocInfos = doFilterArchived(repoDocInfos, filter);
        repoDocInfos = doFilterByTags(repoDocInfos, filter);
        return repoDocInfos;
    }
    DocRepoFilters2.execute = execute;
    function doFilterValid(repoDocs, filter) {
        return repoDocs.filter(current => RepoDocInfos_1.RepoDocInfos.isValid(current));
    }
    function doFilterByTitle(repoDocs, filter) {
        if (!Strings_1.Strings.empty(filter.title)) {
            const toSTR = (value) => {
                return Optional_1.Optional.of(value)
                    .getOrElse("")
                    .toLowerCase();
            };
            const searchString = toSTR(filter.title);
            return repoDocs.filter(current => {
                const title = toSTR(current.title);
                const filename = toSTR(current.filename);
                return title.includes(searchString) || filename.includes(searchString);
            });
        }
        return repoDocs;
    }
    function doFilterFlagged(repoDocs, filter) {
        if (filter.flagged) {
            return repoDocs.filter(current => current.flagged);
        }
        return repoDocs;
    }
    function doFilterArchived(repoDocs, filter) {
        if (!filter.archived) {
            return repoDocs.filter(current => !current.archived);
        }
        return repoDocs;
    }
    function doFilterByTags(repoDocs, filter) {
        if (!filter.tags || filter.tags.length === 0) {
            return repoDocs;
        }
        if (filter.tags && filter.tags.length === 1 && filter.tags[0].id === '/') {
            return repoDocs;
        }
        const tags = filter.tags.filter(current => current.id !== '/');
        return TagMatcher2_1.TagMatcher2.filter(repoDocs, tags);
    }
})(DocRepoFilters2 = exports.DocRepoFilters2 || (exports.DocRepoFilters2 = {}));
//# sourceMappingURL=DocRepoFilters2.js.map