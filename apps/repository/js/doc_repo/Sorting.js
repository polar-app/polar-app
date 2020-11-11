"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sorting = void 0;
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var Sorting;
(function (Sorting) {
    function reverse(order) {
        return order === 'asc' ? 'desc' : 'asc';
    }
    Sorting.reverse = reverse;
    function descendingComparator(a, b, orderBy) {
        const toVal = (value) => {
            if (value === undefined || value === null) {
                return "";
            }
            if (typeof value === 'number' || typeof value === 'string') {
                return value;
            }
            return Object.keys(value)
                .map(current => current.toLowerCase())
                .sort()
                .join(', ');
        };
        const aVal = toVal(a[orderBy]);
        const bVal = toVal(b[orderBy]);
        if (typeof aVal === 'number') {
            return bVal - aVal;
        }
        return bVal.localeCompare(aVal);
    }
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    Sorting.getComparator = getComparator;
    function stableSort(array, comparator) {
        return ArrayStreams_1.arrayStream(array)
            .sort(comparator)
            .collect();
    }
    Sorting.stableSort = stableSort;
})(Sorting = exports.Sorting || (exports.Sorting = {}));
//# sourceMappingURL=Sorting.js.map