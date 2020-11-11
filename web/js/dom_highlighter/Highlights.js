"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highlights = void 0;
const Rects_1 = require("../Rects");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const Preconditions_1 = require("polar-shared/src/Preconditions");
var Highlights;
(function (Highlights) {
    function toHighlightViewportPositions(nodeTextRegions) {
        function splitNodeTextRegion(nodeTextRegion) {
            function createNodeTextRegion(start) {
                return Object.assign(Object.assign({}, nodeTextRegion), { start, end: start + 1 });
            }
            return Numbers_1.Numbers.range(nodeTextRegion.start, nodeTextRegion.end - 1)
                .map(createNodeTextRegion);
        }
        function createSplitNodeTextRegions() {
            return ArrayStreams_1.arrayStream(nodeTextRegions)
                .map(splitNodeTextRegion)
                .flatMap(current => current)
                .collect();
        }
        function createHighlightViewportPositions(nodeTextRegions) {
            function toHighlightViewportPositions(nodeTextRegion) {
                const viewportPosition = Highlights.createViewportPosition(nodeTextRegion);
                return Object.assign(Object.assign({}, viewportPosition), nodeTextRegion);
            }
            return nodeTextRegions.map(toHighlightViewportPositions);
        }
        function mergeHighlightViewportPositions(highlightViewportPositions) {
            function toKey(highlightViewportPosition) {
                return highlightViewportPosition.nodeID + ':' + highlightViewportPosition.top + ':' + highlightViewportPosition.height;
            }
            function merge(groupPositions) {
                const sorted = ArrayStreams_1.arrayStream(groupPositions)
                    .sort((a, b) => a.start - b.start)
                    .collect();
                const first = Arrays_1.Arrays.first(sorted);
                const last = Arrays_1.Arrays.last(sorted);
                const left = first.left;
                const right = last.left + last.width;
                const width = right - left;
                return {
                    top: first.top,
                    left: first.left,
                    height: first.height,
                    width,
                    node: first.node,
                    nodeID: first.nodeID,
                    start: first.start,
                    end: last.end
                };
            }
            return ArrayStreams_1.arrayStream(highlightViewportPositions)
                .group(toKey)
                .map(merge)
                .collect();
        }
        const splitNodeTextRegions = createSplitNodeTextRegions();
        const highlightViewportPositions = createHighlightViewportPositions(splitNodeTextRegions);
        return mergeHighlightViewportPositions(highlightViewportPositions);
    }
    Highlights.toHighlightViewportPositions = toHighlightViewportPositions;
    function intersects(parent, child) {
        return Rects_1.Rects.intersect(Rects_1.Rects.createFromBasicRect(parent), Rects_1.Rects.createFromBasicRect(child));
    }
    Highlights.intersects = intersects;
    function intersectsWithWindow(position) {
        const doc = position.node.ownerDocument;
        if (!doc) {
            return false;
        }
        const win = doc.defaultView;
        if (!win) {
            return false;
        }
        const parent = {
            top: 0,
            left: 0,
            width: win.innerWidth,
            height: win.innerHeight
        };
        return intersects(parent, position);
    }
    Highlights.intersectsWithWindow = intersectsWithWindow;
    function rangeToText(range) {
        const contents = range.cloneContents();
        const div = document.createElement('div');
        div.append(contents);
        return div.innerText;
    }
    function createViewportPosition(highlight) {
        const { node } = highlight;
        const doc = node.ownerDocument;
        if (!doc) {
            throw new Error("Node has no owner document");
        }
        const range = doc.createRange();
        function computeEnd() {
            var _a;
            if (!node.nodeValue) {
                return 0;
            }
            return Math.min((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.length, highlight.end + 1);
        }
        try {
            range.setStart(node, highlight.start);
            range.setEnd(node, computeEnd());
        }
        catch (e) {
            console.warn(`Unable to mount annotation on node: ${e.message}`, node);
            throw e;
        }
        const rect = range.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    }
    Highlights.createViewportPosition = createViewportPosition;
    function fixedToAbsolute(position) {
        Preconditions_1.Preconditions.assertPresent(position, 'position');
        const doc = position.node.ownerDocument;
        const win = doc.defaultView;
        const scrollLeft = (win === null || win === void 0 ? void 0 : win.pageXOffset) || doc.documentElement.scrollLeft;
        const scrollTop = (win === null || win === void 0 ? void 0 : win.pageYOffset) || doc.documentElement.scrollTop;
        return {
            top: position.top + scrollTop,
            left: position.left + scrollLeft,
            width: position.width,
            height: position.height
        };
    }
    Highlights.fixedToAbsolute = fixedToAbsolute;
})(Highlights = exports.Highlights || (exports.Highlights = {}));
//# sourceMappingURL=Highlights.js.map