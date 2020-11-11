"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocAnnotationSorter = void 0;
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var DocAnnotationSorter;
(function (DocAnnotationSorter) {
    function sort(data) {
        const computeScore = (item) => {
            function computePrefix() {
                return item.pageNum * 100000;
            }
            function computeSuffix() {
                if (item.order !== undefined) {
                    return item.order * 100;
                }
                else {
                    return (item.position.y * 100) + item.position.x;
                }
            }
            const prefix = computePrefix();
            const suffix = computeSuffix();
            return prefix + suffix;
        };
        const compareFn = (a, b) => {
            const diff = computeScore(a) - computeScore(b);
            if (diff === 0) {
                return a.id.localeCompare(b.id);
            }
            return diff;
        };
        return ArrayStreams_1.arrayStream(data).sort(compareFn).collect();
    }
    DocAnnotationSorter.sort = sort;
})(DocAnnotationSorter = exports.DocAnnotationSorter || (exports.DocAnnotationSorter = {}));
//# sourceMappingURL=DocAnnotationSorter.js.map