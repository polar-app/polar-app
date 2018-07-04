const {Preconditions} = require("../../../Preconditions");

class TextNodes {

    /**
     * Create a Range around this textNode so that we can compute metadata like
     * the clientRects which normally can't be determined from a TextNode.
     *
     * @param textNode
     * @param offset
     * @param length
     * @return {Range}
     */
    static getRange(textNode, offset, length) {

        Preconditions.assertNotNull(textNode, "textNode");

        if(! offset) {
            offset = 0;
        }

        if(! length) {
            length = textNode.textContent.length;
        }

        let range = document.createRange();

        range.setStart(textNode, offset);
        range.setEnd(textNode, length);

        return range;

    }

    /**
     *
     * @param textNode {Node}
     * @param offset {number}
     * @param length {number}
     */
    static getClientRects(textNode, offset, length) {
        return range.getClientRects();
    }

}

module.exports.TextNodes = TextNodes;
