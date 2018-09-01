"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeTypes_1 = require("./NodeTypes");
class MockSelections {
    static createSyntheticSelection(start, end) {
        let selection = window.getSelection();
        selection.empty();
        let range = document.createRange();
        range.setStart(start.node, start.offset);
        console.log("end.node type is: " + NodeTypes_1.NodeTypes.toSymbol(end.node.nodeType));
        range.setEnd(end.node, end.offset);
        selection.addRange(range);
        return selection;
    }
}
exports.MockSelections = MockSelections;
//# sourceMappingURL=MockSelections.js.map