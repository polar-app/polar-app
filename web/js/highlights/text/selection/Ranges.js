
const {Preconditions} = require("../../../Preconditions");

class Ranges {

    /**
     * Create duplicate of the given ranges so that we can know that we have
     * our own unique copies that can't be reset.
     *
     * @param ranges {Array<Range>}
     * @return {Array<Range>}
     */
    static cloneRanges(ranges) {
        return ranges.map(range => range.cloneRange());
    }

    static splitTextNode(container, offset) {

        if(container.nodeType !== Node.TEXT_NODE) {
            return;
        }

        container.splitText(offset);

    }

    /**
     * Get the text nodes for range. Optionally splitting the text if necessary
     *
     * @param range {Range}
     */
    static getTextNodes(range) {

        Preconditions.assertNotNull(range, "range")

        Ranges.splitTextNode(range.startContainer, range.startOffset);
        Ranges.splitTextNode(range.endContainer, range.endOffset);

        let doc = range.startContainer.ownerDocument;

        // use TreeWalker to walk the commonAncestorContainer and we see which
        // ranges contain which text nodes.
        let treeWalker = doc.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);

        let result = [];

        let node;

        while(node = treeWalker.nextNode()) {

            // TODO: This isn't portable to IE at ALL ... but I think there is
            // another method which will allow us to know how the node interacts
            // with the range. Specifically, whether it's before, after, or
            // after and before.  I couldn't find it when I was implementing
            // this.
            if(range.intersectsNode(node)) {
                result.push(node);
            }

        }

        return result;

    }

}

module.exports.Ranges = Ranges;
