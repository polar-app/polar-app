const {TextNodes} = require("./TextNodes");
const {Rects} = require("../../../Rects");

/**
 * A TextNode with an associated rect.
 */
class TextNodeRect {

    /**
     *
     * @param textNode {Node}
     * @param rect {DOMRect}
     */
    constructor(textNode, rect) {
        this.textNode = textNode;
        this.rect = Rects.validate(rect);
    }

}

/**
 *
 * Keep the list of elements together that are in a specific row.  We consider
 * a row items with the same 'top' and 'bottom' index so effectively everything
 * with the same height, in the same parent element, and adjacent.  We then
 * build everything into rows and columns.
 *
 */
class RowIndex {

    constructor() {

        /**
         * @type {Map<String,Array<TextNodeRect>>}
         */
        this.rows = {};

    }

    /**
     * @param textNodeRect {TextNodeRect}
     */
    update(textNodeRect) {

        let rowKey = this.computeRowKey(textNodeRect.rect);

        if (! (rowKey in this.rows)) {
            this.rows[rowKey] = [];
        }

        let row = this.rows[rowKey];

        if(!row) {
            throw new Error("No row for key: " + rowKey);
        }

        row.push(textNodeRect);

    }

    /**
     * @return {Array<string>}
     */
    getRows() {
        return Object.keys(this.rows);
    }

    /**
     *
     * @param row {String}
     * @return {*}
     */
    getRow(row) {
        return this.rows[row];
    }

    /**
     * Get metadata about the current index including the keys and number of entries per row.
     *
     */
    meta() {

        let result = {};

        let keys = Object.keys(this.rows);

        keys.forEach(key => {
            result[key] = this.rows[key].length;
        });

        return result;

    }

    /**
     *
     * @param rect {DOMRect}
     * @return {string}
     */
    computeRowKey(rect) {
        return `${rect.top}:${rect.bottom}`;
    }

}

// FIXME 'blocks' should be contigous regions of text highlights ...

/**
 * Build rows of contiguous text nodes plus break them apart based on how they
 * display visually.
 */
class TextNodeRows {

    static splitNode(node) {

        let result = 0;

        Array.from(node.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {
                result += TextNodeRows.splitTextNode(current);

            }

            if(current.nodeType === Node.ELEMENT_NODE) {

                // this is a regular element recurse into it splitting that too.

                result += TextNodeRows.splitNode(current, result);

            }

        });

        return result;

    }

    /**
     *
     * Compute the row index for text nodes that are already split.
     *
     * @param node {Node}
     * @param rowIndex {RowIndex}
     */
    static computeRowIndex(node, rowIndex) {

        if(!rowIndex) {
            rowIndex = new RowIndex();
        }

        Array.from(node.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {

                if(current.textContent.length > 1) {
                    throw new Error("Node not split properly.");
                }

                let rect = TextNodes.getRange(current).getBoundingClientRect();
                let textNodeRect = new TextNodeRect(current, rect);

                rowIndex.update(textNodeRect);

            }

            if(current.nodeType === Node.ELEMENT_NODE) {

                // this is a regular element recurse into it splitting that too.

                TextNodeRows.computeRowIndex(current, rowIndex);

            }

        });

        return rowIndex;

    }

    /**
     * Split the given text node so that every character has its own text
     * node so that we can see the actual position on the screen.
     *
     * @return {number} The number of splits we performed.
     */
    static splitTextNode(textNode) {

        let result = 0;

        while(textNode.textContent.length > 1) {
            textNode = textNode.splitText(1);
            ++result;
        }

        return result;

    }

}

module.exports.TextNodeRows = TextNodeRows;
