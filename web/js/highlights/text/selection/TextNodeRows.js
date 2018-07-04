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
    getKeys() {
        return Object.keys(this.rows);
    }

    /**
     *
     * @param rowKey {String}
     * @return {*}
     */
    getRow(rowKey) {
        return this.rows[rowKey];
    }

    /**
     *
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
 *
 * This algorithm has three steps:
 *
 * - split all the text nodes into single char text nodes
 * - find all 'regions' of contiguous text nodes
 *
 * - then find all 'blocks' in these regions by splitting the regions where
 *   the text starts a new row vertically.
 *
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
     * Text regions are groups of contiguous text nodes that are back to back
     * without an element in between.
     *
     * @param node
     * @return {Array<Array<Node>>}
     */
    static computeTextRegions(node, regions) {

        // all text regions that we're working on
        if(!regions) {
            regions = [];
        }

        // the current region
        let region = [];

        Array.from(node.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {
                region.push(current);
            }

            if(current.nodeType === Node.ELEMENT_NODE) {

                regions.push(region);
                region = [];

                TextNodeRows.computeTextRegions(current, regions);

            }

        });

        return regions;

    }

    /**
     * From the regions we can compute the blocks if the Rect rows aren't the same.
     * @param regions {Array<Array<Node>>}
     */
    static computeTextBlocks(regions) {

        let blocks = [];

        regions.forEach(region => {

            if(region.length === 1) {
                // we're done with this region as it's a complete block already.
                blocks.push(region);
                return;
            }

            let block = [];

            region.forEach(curr => {

                let prevRect = TextNodes.getRange(curr.previousSibling).getBoundingClientRect();
                let currRect = TextNodes.getRange(curr).getBoundingClientRect();

                if(TextNodeRows.computeRowKey(prevRect) === TextNodeRows.computeRowKey(currRect)) {
                    block.push(curr);
                } else {
                    blocks.push(block);
                    block = [];
                }

            });

        });

        return blocks;

    }

    /**
     *
     * @param rect {DOMRect}
     * @return {string}
     */
    static computeRowKey(rect) {
        return `${rect.top}:${rect.bottom}`;
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

                // TODO: what about zero width text?

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
     * Compute chunks of contiguous text nodes..
     *
     * @param node {Node}
     * @param chunks {Array<Array<Node>>}
     */
    static computeChunks(node, chunks) {

        if(!chunks) {
            chunks = [];
        }

        Array.from(node.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {

                if(current.textContent.length > 1) {
                    throw new Error("Node not split properly.");
                }

                // TODO: what about zero width text?

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
     * Compute the blocks from the row index.
     *
     * @param rowIndex {RowIndex}
     */
    static computeBlocks(rowIndex) {

        // the blocks we're working with.
        let result = [];

        rowIndex.getKeys().forEach(rowKey => {
            let row = rowIndex.getRow(rowKey);
            row.sort((a,b) => a.rect.left - b.rect.left)
        })

        return result;

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
