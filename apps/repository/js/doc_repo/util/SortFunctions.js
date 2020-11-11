"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortFunctions = void 0;
class SortFunctions {
    static compareWithEmptyStringsLast(a, b, formatter) {
        const strA = formatter(a);
        const strB = formatter(b);
        if (strA === '' || strB === '') {
            if (strA === '' && strB === '') {
                return 0;
            }
            else if (strA === "") {
                return 1;
            }
            else {
                return -1;
            }
        }
        return strA.localeCompare(strB);
    }
}
exports.SortFunctions = SortFunctions;
//# sourceMappingURL=SortFunctions.js.map