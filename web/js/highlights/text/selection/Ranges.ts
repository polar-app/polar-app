import {Preconditions} from '../../../Preconditions';

export class Ranges {

    /**
     * Create duplicate of the given ranges so that we can know that we have
     * our own unique copies that can't be reset.
     *
     */
    static cloneRanges(ranges: Range[]) {
        return ranges.map(range => range.cloneRange());
    }

    /**
     * Split a text node and get the new / starting node.
     *
     */
    static splitTextNode(container: Node, offset: number, useStartBoundary: boolean) {

        if(container.nodeType !== Node.TEXT_NODE) {

            if(offset > 0) {
                // I don't think this is actually a real-world case.
                throw new Error("We don't know how to deal with non-zero yet.");
            }

            return container;

        }

        let newNode = (<Text>container).splitText(offset)

        if(useStartBoundary) {
            return newNode;
        } else {
            return newNode.previousSibling;
        }

    }

    /**
     * Return HTML content of the range selected.
     *
     * @param range
     */
    static toHTML(range: Range) {

        let result = "";

        let docFragment = range.cloneContents();

        docFragment.childNodes.forEach(childNode => {

            if(childNode.nodeType === Node.TEXT_NODE) {
                result += childNode.textContent;
            } else {
                result += (<HTMLElement>childNode).outerHTML;
            }

        });

        return result;

    }

    /**
     * Get the text nodes for range. Optionally splitting the text if necessary
     *
     * @param range {Range}
     * @return {Array<Node>}
     */
    static getTextNodes(range: Range) {

        Preconditions.assertNotNull(range, "range")

        // We start walking the tree until we find the start node, then we
        // enable set inSelection = true... then when we exit the selection by
        // hitting the end node we just return out of the while loop and we're
        // done

        let startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        let endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);

        Preconditions.assertNotNull(startNode, "startNode");
        Preconditions.assertNotNull(endNode, "endNode");

        let doc = range.startContainer.ownerDocument;

        // use TreeWalker to walk the commonAncestorContainer and we see which
        // ranges contain which text nodes.
        let treeWalker = doc.createTreeWalker(range.commonAncestorContainer);

        let result = [];

        let node;

        let inSelection = false;

        // ** traverse until we find the start
        while(node = treeWalker.nextNode()) {
            if( startNode === node) {
                inSelection = true;
                break;
            }

        }

        // ** now keep consuming until we hit the last node.

        while(node) {

            if(node.nodeType === Node.TEXT_NODE) {
                result.push(node);
            }

            if(endNode === node)
                break;

            node = treeWalker.nextNode();

        }

        return result;

    }

    static describeNode(node: Node) {
        return (<HTMLElement>node.cloneNode(false)).outerHTML;
    }

}
