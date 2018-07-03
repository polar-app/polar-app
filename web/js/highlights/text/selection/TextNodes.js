class TextNodes {

    static getRange(textNode, offset, length) {

        // TODO: make this a toRange function so we can call other functions
        // on the range if we want.

        if(! offset) {
            offset = 0;
        }

        if(! length) {
            length = textNode.textContent.length;
        }

        let selection = window.getSelection();
        selection.empty();

        let range = document.createRange();

        range.setStart(textNode, offset);
        range.setEnd(textNode, length);

        selection.addRange(range);

        return range;

    }

    /**
     *
     * WARNING.  This will reset the current window selection.
     *
     * @param textNode {Node}
     * @param offset {number}
     * @param length {number}
     */
    static getClientRects(textNode, offset, length) {

        // FIXME: do I need to call selection.addRange for this to work?

        return range.getClientRects();

    }

}

module.exports.TextNodes = TextNodes;
