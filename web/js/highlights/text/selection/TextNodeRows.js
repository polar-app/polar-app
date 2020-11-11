"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNodeRows = exports.NodeArray = exports.TextRegion = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const TextNodes_1 = require("./TextNodes");
const Rects_1 = require("../../../Rects");
const Text_1 = require("../../../util/Text");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Tuples_1 = require("polar-shared/src/util/Tuples");
var createSiblings = Tuples_1.Tuples.createSiblings;
class TextRegion {
    constructor() {
        this.textNodes = [];
    }
    push(textNode) {
        if (textNode.textContent.length > 1) {
            throw new Error("Nodes must be split");
        }
        this.textNodes.push(textNode);
    }
    getTextNodes() {
        return this.textNodes;
    }
    get length() {
        return this.textNodes.length;
    }
    toString() {
        let result = "";
        this.textNodes.forEach(textNode => {
            result += textNode.textContent;
        });
        return result;
    }
    format() {
        return `(${this.textNodes.length}): \n` + Text_1.Text.indent(this.toString(), "  ");
    }
    toJSON() {
        return { nrNodes: this.textNodes.length, text: this.toString() };
    }
}
exports.TextRegion = TextRegion;
class TextBlock extends TextRegion {
}
class MergedTextBlock {
    constructor(obj) {
        this.textNode = obj.textNode;
        this.rect = obj.rect;
        this.text = obj.text;
    }
    toString() {
        return this.text;
    }
    toExternal() {
        return { text: this.text, rect: this.rect };
    }
}
class NodeArray {
    constructor(nodes) {
        Preconditions_1.Preconditions.assertNotNull(nodes, "nodes");
        this.nodes = nodes;
    }
    get length() {
        return this.nodes.length;
    }
    static createFromElement(element) {
        if (element.nodeType === Node.ELEMENT_NODE) {
            return new NodeArray(element.childNodes);
        }
        else if (element.nodeType === Node.TEXT_NODE) {
            throw new Error("Text node not supported");
        }
        else {
            throw new Error("Unable to handle node type: " + element.nodeType);
        }
    }
}
exports.NodeArray = NodeArray;
class TextNodeRows {
    static fromTextNode(textNode) {
        if (textNode.nodeType !== Node.TEXT_NODE) {
            throw new Error("Not a text node");
        }
        const nodeArray = TextNodeRows.splitTextNodePerCharacter(textNode);
        const textRegions = TextNodeRows.computeTextRegions(nodeArray);
        const textBlocks = TextNodeRows.computeTextBlocks(textRegions);
        const mergedTextBlocks = TextNodeRows.mergeTextBlocks(textBlocks);
        return mergedTextBlocks.map(current => current.textNode);
    }
    static fromTextNodes(textNodes) {
        return ArrayStreams_1.arrayStream(textNodes)
            .map(TextNodeRows.fromTextNode)
            .flatMap(current => current)
            .collect();
    }
    static splitElement(element) {
        let result = 0;
        Array.from(element.childNodes).forEach(current => {
            if (current.nodeType === Node.TEXT_NODE) {
                const nodeArray = TextNodeRows.splitTextNodePerCharacter(current);
                result += nodeArray.length;
            }
            if (current.nodeType === Node.ELEMENT_NODE) {
                result += TextNodeRows.splitElement(current);
            }
        });
        return result;
    }
    static computeTextRegions(nodeArray) {
        return this.computeTextRegions0(nodeArray, []);
    }
    static computeTextRegions0(nodeArray, textRegions) {
        Preconditions_1.Preconditions.assertPresent(nodeArray, "nodeArray");
        if (nodeArray.constructor !== NodeArray) {
            throw new Error("Not a node array: " + nodeArray.constructor);
        }
        if (!textRegions) {
            textRegions = [];
        }
        let textRegion = new TextRegion();
        for (const position of createSiblings(nodeArray.nodes)) {
            const currentNode = position.curr;
            if (currentNode.nodeType === Node.TEXT_NODE) {
                textRegion.push(currentNode);
            }
            else if (currentNode.nodeType === Node.ELEMENT_NODE) {
                textRegions.push(textRegion);
                textRegion = new TextRegion();
                TextNodeRows.computeTextRegions0(NodeArray.createFromElement(currentNode), textRegions);
            }
            if (position.next === undefined && textRegion.length > 0) {
                textRegions.push(textRegion);
            }
        }
        return textRegions;
    }
    static computeTextBlocks(textRegions) {
        const textBlocks = [];
        textRegions.forEach(textRegion => {
            let textBlock = new TextBlock();
            let prevRect = null;
            createSiblings(textRegion.getTextNodes()).forEach(position => {
                const currRect = TextNodes_1.TextNodes.getRange(position.curr).getBoundingClientRect();
                if (Rects_1.Rects.isVisible(currRect)) {
                    if (prevRect != null) {
                        if (TextNodeRows.computeRowKey(prevRect) !== TextNodeRows.computeRowKey(currRect)) {
                            textBlocks.push(textBlock);
                            textBlock = new TextBlock();
                        }
                    }
                    prevRect = currRect;
                }
                textBlock.push(position.curr);
                if (position.next === undefined && textBlock.length > 0) {
                    textBlocks.push(textBlock);
                }
            });
        });
        return textBlocks;
    }
    static mergeTextBlocks(textBlocks) {
        const result = [];
        textBlocks.forEach(textBlock => {
            const textNodes = textBlock.getTextNodes().slice();
            const text = textBlock.toString();
            const textNode = textNodes.pop();
            textNode.textContent = text;
            textNodes.forEach(orphanedNode => {
                orphanedNode.parentNode.removeChild(orphanedNode);
            });
            result.push(new MergedTextBlock({
                textNode,
                text,
                rect: TextNodes_1.TextNodes.getRange(textNode).getBoundingClientRect()
            }));
        });
        return result;
    }
    static computeRowKey(rect) {
        return `${rect.top}:${rect.bottom}`;
    }
    static splitTextNodePerCharacter(textNode) {
        const result = [];
        while (textNode.textContent && textNode.textContent.length > 1) {
            result.push(textNode);
            textNode = textNode.splitText(1);
        }
        result.push(textNode);
        return new NodeArray(result);
    }
}
exports.TextNodeRows = TextNodeRows;
//# sourceMappingURL=TextNodeRows.js.map