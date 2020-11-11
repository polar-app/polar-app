"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ranges = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
class Ranges {
    static cloneRanges(ranges) {
        return ranges.map(range => range.cloneRange());
    }
    static splitTextNode(container, offset, useStartBoundary) {
        if (container.nodeType !== Node.TEXT_NODE &&
            container.nodeType !== Node.COMMENT_NODE &&
            container.nodeType !== Node.CDATA_SECTION_NODE) {
            if (offset > 0) {
                return container.childNodes[offset];
            }
            return container;
        }
        const newNode = container.splitText(offset);
        if (useStartBoundary) {
            return newNode;
        }
        else {
            return newNode.previousSibling;
        }
    }
    static toHTML(range) {
        let result = "";
        const docFragment = range.cloneContents();
        docFragment.childNodes.forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE) {
                result += childNode.textContent;
            }
            else {
                result += childNode.outerHTML;
            }
        });
        return result;
    }
    static toText(range) {
        const docFragment = range.cloneContents();
        function childNodeToText(childNode) {
            if (childNode.nodeType === Node.TEXT_NODE) {
                return childNode.textContent;
            }
            else {
                return childNode.innerText;
            }
        }
        return ArrayStreams_1.arrayStream(Array.from(docFragment.childNodes))
            .map(childNodeToText)
            .filter(current => current !== null)
            .map(current => current)
            .collect()
            .join("");
    }
    static getTextNodes(range) {
        Preconditions_1.Preconditions.assertPresent(range, "range");
        const startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        const endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);
        Preconditions_1.Preconditions.assertPresent(startNode, "startNode");
        Preconditions_1.Preconditions.assertPresent(endNode, "endNode");
        const doc = range.startContainer.ownerDocument;
        const treeWalker = doc.createTreeWalker(range.commonAncestorContainer);
        const result = [];
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
            if (endNode === node) {
                break;
            }
            node = treeWalker.nextNode();
        }
        return result;
    }
    static hasText(range) {
        const doc = range.startContainer.ownerDocument;
        const contents = range.cloneContents();
        const div = doc.createElement('div');
        div.appendChild(contents);
        const text = div.innerText;
        return text.trim() !== '';
    }
    static hasTextWithNodeSplit(range) {
        Preconditions_1.Preconditions.assertPresent(range, "range");
        const startNode = Ranges.splitTextNode(range.startContainer, range.startOffset, true);
        const endNode = Ranges.splitTextNode(range.endContainer, range.endOffset, false);
        if (!startNode || !endNode) {
            return false;
        }
        const doc = range.startContainer.ownerDocument;
        const treeWalker = doc.createTreeWalker(range.commonAncestorContainer);
        const result = [];
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
                if (node.textContent && node.textContent.trim() !== '') {
                    return true;
                }
            }
            if (endNode === node) {
                break;
            }
            node = treeWalker.nextNode();
        }
        return false;
    }
    static describeNode(node) {
        return node.cloneNode(false).outerHTML;
    }
}
exports.Ranges = Ranges;
//# sourceMappingURL=Ranges.js.map