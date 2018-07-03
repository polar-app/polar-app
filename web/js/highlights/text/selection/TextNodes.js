class TextNodes {

    static getRange(textNode, offset, length) {

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
