"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../../Preconditions");
class Ranges {
    static cloneRanges(ranges) {
        return ranges.map(range => range.cloneRange());
    }
    static splitTextNode(container, offset, useStartBoundary) {
        if (container.nodeType !== Node.TEXT_NODE) {
            if (offset > 0) {
                throw new Error("We don't know how to deal with non-zero yet.");
            }
            return container;
        }
        let newNode = container.splitText(offset);
        if (useStartBoundary) {
            return newNode;
        }
        else {
            return newNode.previousSibling;
        }
    }
    static toHTML(range) {
        let result = "";
        let docFragment = range.cloneContents();
        docFragment.childNodes.forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                result += childNode.textContent;
            }
            else {
                result += childNode.innerHTML;
            }
        });
        return result;
    }
    static getTextNodes(range) {
        Preconditions_1.Preconditions.assertNotNull(range, "range");
        let startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        let endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);
        Preconditions_1.Preconditions.assertNotNull(startNode, "startNode");
        Preconditions_1.Preconditions.assertNotNull(endNode, "endNode");
        let doc = range.startContainer.ownerDocument;
        let treeWalker = doc.createTreeWalker(range.commonAncestorContainer);
        let result = [];
        let node;
        let inSelection = false;
        while (node = treeWalker.nextNode()) {
            if (startNode === node) {
                inSelection = true;
                break;
            }
        }
        while (node) {
            if (node.nodeType === Node.TEXT_NODE) {
                result.push(node);
            }
            if (endNode === node)
                break;
            node = treeWalker.nextNode();
        }
        return result;
    }
    static describeNode(node) {
        return node.cloneNode(false).outerHTML;
    }
}
exports.Ranges = Ranges;
//# sourceMappingURL=Ranges.js.map