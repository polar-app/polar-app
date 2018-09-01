"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Selections {
    static toRanges(selection) {
        let result = [];
        for (let idx = 0; idx < selection.rangeCount; idx++) {
            let range = selection.getRangeAt(idx);
            result.push(range);
        }
        return result;
    }
}
exports.Selections = Selections;
//# sourceMappingURL=Selections.js.map