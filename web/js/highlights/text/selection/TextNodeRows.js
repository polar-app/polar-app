const {TextNodes} = require("./TextNodes");
const {Rects} = require("../../../Rects");
const {createSiblings} = require("../../../util/Functions");
const {Text} = require("../../../util/Text");


/**
 * A region of text within the document where the nodes are split and are back to
 * back without an element in between but MAY be between different rows.
 */
class TextRegion {

    constructor() {
        this.textNodes = [];
    }

    push(textNode) {

        if(textNode.textContent.length > 1) {
            throw new Error("Nodes must be split");
        }

        this.textNodes.push(textNode);
    }

    /**
     * Return the nodes for this region.
     */
    getTextNodes() {
        return this.textNodes;
    }

    get length() {
        return this.textNodes.length;
    }

    /**
     * Return an array of text nodes into a string.
     */
    toString() {

        let result = "";

        this.textNodes.forEach(textNode => {
            result += textNode.textContent;
        });

        return result;

    }

    format() {
        return `(${this.textNodes.length}): \n` + Text.indent(this.toString(), "  ");
    }

    toJSON() {
        return { nrNodes: this.textNodes.length, text: this.toString() };
    }

}

/**
 * A TextBlock are structurally the same as TextRegion but semantically a
 * TextBlock is on different visual rows.
 */
class TextBlock extends TextRegion {

}

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

    /**
     *
     * @param node The root node to split.
     * @return {number} The number of nodes split.
     */
    static splitNode(node) {

        let result = 0;

        Array.from(node.childNodes).forEach(current => {

            if(current.nodeType === Node.TEXT_NODE) {
                result += TextNodeRows.splitTextNodePerCharacter(current);
            }

            if(current.nodeType === Node.ELEMENT_NODE) {

                // this is a regular element recurse into it splitting that too.

                result += TextNodeRows.splitNode(current);

            }

        });

        console.log("FIXME returning: " + result);

        return result;

    }

    /**
     * Text regions are groups of contiguous text nodes that are back to back
     * without an element in between.
     *
     * @param node
     * @param [textRegions] {Array<TextRegion>} The starting text regions. Used mostly for recursion.
     * @return {Array<TextRegion>} The computed text regions
     */
    static computeTextRegions(node, textRegions) {

        // all text regions that we're working on
        if(!textRegions) {
            textRegions = [];
        }

        // the current region
        /**
         * @type {TextRegion}
         */
        let textRegion = new TextRegion();

        createSiblings(node.childNodes).forEach(position => {

            let currentNode = position.curr;

            if(currentNode.nodeType === Node.TEXT_NODE) {
                textRegion.push(currentNode);
            }

            if(currentNode.nodeType === Node.ELEMENT_NODE) {

                textRegions.push(textRegion);
                textRegion = new TextRegion();

                TextNodeRows.computeTextRegions(currentNode, textRegions);

            }

            // *** handle the last node

            if(position.next === null) {
                // don't drop the last block
                textRegions.push(textRegion);
            }

        });

        return textRegions;

    }

    /**
     * From the regions we can compute the blocks if the Rect rows aren't the
     * same.
     *
     * The rect rows are computed by looking at the top and bottom of the row
     * to see if they are different.
     *
     * @param textRegions {Array<TextRegion>}
     * @return {Array<TextBlock>}
     */
    static computeTextBlocks(textRegions) {

        /**
         * @type {Array<TextBlock>}
         */
        let textBlocks = [];

        textRegions.forEach(textRegion => {

            /**
             * @type {TextBlock}
             */
            let textBlock = new TextBlock();

            // keep track of the previous (visible) rect that we've seen so that
            // we can compare our position.

            /**
             * @type {DOMRect}
             */
            let prevRect = null;

            createSiblings(textRegion.getTextNodes()).forEach(position => {

                // *** handle middle nodes

                let currRect = TextNodes.getRange(position.curr).getBoundingClientRect();

                if(Rects.isVisible(currRect)) {

                    if(prevRect != null) {

                        // we have seen at least one rect before so we can compare them now.

                       if(TextNodeRows.computeRowKey(prevRect) !== TextNodeRows.computeRowKey(currRect)) {
                           // we're in a new block now as we've jumped to a new visual row.
                           textBlocks.push(textBlock);
                           textBlock = new TextBlock();
                       }

                    }

                    // since the current rect is visible we can update the
                    // prevRect to avoid \n \r issues which have zero width.
                    prevRect = currRect;

                }


                textBlock.push(position.curr);

                // *** handle the last node

                if(position.next === null) {
                    // don't drop the last block
                    textBlocks.push(textBlock);
                }

            });

        });

        return textBlocks;

    }

    static joinBlock(block) {

        if(block.length === 0) {
            return;
        }

        // we will expand the block into this node.
        let target = block.pop();

        block.forEach(current => {
            target.textContent += current.textContent;
            current.parentElement.removeChild(current);
        });

        return { node: target, text: target.textContent};

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
    static splitTextNodePerCharacter(textNode) {

        let result = 0;

        while(textNode.textContent.length > 1) {
            textNode = textNode.splitText(1);
            ++result;
        }

        return result;

    }

}

module.exports.TextNodeRows = TextNodeRows;
