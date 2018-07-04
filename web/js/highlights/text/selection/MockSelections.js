const {NodeTypes} = require("./NodeTypes");

class NodeOffset {

    /**
     *
     * @param obj
     */
    constructor(obj) {

        /**
         * The DOM node where this
         * @type {Node}
         */
        this.node = null;

        /**
         *
         * The offset in this node where the selection begin/ends.
         *
         * @type {number}
         */
        this.offset = null;

        Object.assign(this, obj);

    }

}

class MockSelections {

    /**
     *
     *
     * @param start {NodeOffset | Object}
     * @param end {NodeOffset | Object}
     */
    static createSyntheticSelection(start, end) {

        let selection = window.getSelection();

        selection.empty();

        let range = document.createRange();

        range.setStart(start.node, start.offset);

        console.log("end.node type is: " + NodeTypes.toSymbol(end.node.nodeType))

        range.setEnd(end.node, end.offset);

        selection.addRange(range);

        return selection;

    }

}

module.exports.MockSelections = MockSelections;
