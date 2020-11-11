"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selections = void 0;
const Ranges_1 = require("./Ranges");
var Selections;
(function (Selections) {
    function toRanges(selection) {
        const result = [];
        for (let idx = 0; idx < selection.rangeCount; idx++) {
            const range = selection.getRangeAt(idx);
            result.push(range);
        }
        return result;
    }
    Selections.toRanges = toRanges;
    function hasActiveTextSelection(selection) {
        const ranges = Selections.toRanges(selection);
        for (const range of ranges) {
            if (Ranges_1.Ranges.hasText(range)) {
                return true;
            }
        }
        return false;
    }
    Selections.hasActiveTextSelection = hasActiveTextSelection;
})(Selections = exports.Selections || (exports.Selections = {}));
//# sourceMappingURL=Selections.js.map