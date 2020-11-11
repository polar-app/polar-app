"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluidElementPredicates = exports.RangeRects = void 0;
const Arrays_1 = require("polar-shared/src/util/Arrays");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var RangeRects;
(function (RangeRects) {
    function fromElement(element) {
        const bcr = element.getBoundingClientRect();
        const top = bcr.top + element.ownerDocument.defaultView.scrollY;
        const bottom = top + bcr.height;
        return { top, bottom };
    }
    RangeRects.fromElement = fromElement;
    function fromRect(rect) {
        return {
            top: rect.top,
            bottom: rect.top + rect.height
        };
    }
    RangeRects.fromRect = fromRect;
    function contains(container, item) {
        return item.top > container.top && item.bottom < container.bottom;
    }
    RangeRects.contains = contains;
})(RangeRects = exports.RangeRects || (exports.RangeRects = {}));
var FluidElementPredicates;
(function (FluidElementPredicates) {
    function create(direction, boxRect) {
        function toPointer(rect) {
            return direction === 'top' ? rect.top : rect.bottom;
        }
        function filter(element) {
            const elementRect = RangeRects.fromElement(element);
            return RangeRects.contains(boxRect, elementRect);
        }
        function select(elements) {
            const boxRectPointer = toPointer(boxRect);
            function toJSON() {
                return elements.map((current, idx) => {
                    return {
                        idx,
                    };
                });
            }
            function computeDistance(element) {
                const elementRect = RangeRects.fromElement(element);
                const topDistance = Math.abs(elementRect.top - boxRectPointer);
                const bottomDistance = Math.abs(elementRect.bottom - boxRectPointer);
                function computeDistanceAndEdge() {
                    if (topDistance < bottomDistance) {
                        return [topDistance, 'top'];
                    }
                    else {
                        return [bottomDistance, 'bottom'];
                    }
                }
                const [distance, edge] = computeDistanceAndEdge();
                return { value: element, distance, edge };
            }
            const elementDistances = ArrayStreams_1.arrayStream(elements)
                .map(computeDistance)
                .sort((a, b) => a.distance - b.distance)
                .collect();
            const target = Arrays_1.Arrays.first(elementDistances);
            return { elementDistances, target };
        }
        return { filter, select };
    }
    FluidElementPredicates.create = create;
})(FluidElementPredicates = exports.FluidElementPredicates || (exports.FluidElementPredicates = {}));
//# sourceMappingURL=FluidElementPredicates.js.map