"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagMatcher2 = void 0;
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var TagMatcher2;
(function (TagMatcher2) {
    function filter(list, filterTags) {
        const filterTagsMap = ArrayStreams_1.arrayStream(filterTags)
            .toMap(current => current.id);
        function predicate(item) {
            const itemTags = Object.values(item.tags || {});
            for (const itemTag of itemTags) {
                if (filterTagsMap[itemTag.id]) {
                    return true;
                }
            }
            return false;
        }
        return list.filter(predicate);
    }
    TagMatcher2.filter = filter;
})(TagMatcher2 = exports.TagMatcher2 || (exports.TagMatcher2 = {}));
//# sourceMappingURL=TagMatcher2.js.map