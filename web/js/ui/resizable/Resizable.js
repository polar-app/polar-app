"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLElements = exports.Resizable = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const VerticalLine_1 = require("./VerticalLine");
const HorizontalLine_1 = require("./HorizontalLine");
const Rects_1 = require("../../Rects");
const ILTBRRects_1 = require("polar-shared/src/util/rects/ILTBRRects");
exports.Resizable = ReactUtils_1.deepMemo((props) => {
    const [position, setPosition] = react_1.default.useState(props.computeInitialPosition());
    const resizingPositionRef = react_1.default.useRef(position);
    const mouseDown = react_1.default.useRef(false);
    const mouseEventOrigin = react_1.default.useRef(undefined);
    const mouseMoveHandler = react_1.default.useRef(undefined);
    const elementRef = react_1.default.useRef();
    const win = props.window || window;
    const doc = props.document || document;
    const computeBoundsParentElement = react_1.default.useCallback(() => {
        var _a;
        return (_a = elementRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
    }, []);
    const computeBoundsParentElementRect = react_1.default.useCallback(() => {
        const boundsParentElement = computeBoundsParentElement();
        if (boundsParentElement) {
            return Rects_1.Rects.createFromOffset(boundsParentElement);
        }
        return Rects_1.Rects.createFromOffset(doc.body);
    }, [computeBoundsParentElement, doc.body]);
    const toggleUserSelect = react_1.default.useCallback((resizing) => {
        if (resizing) {
            doc.body.style.userSelect = 'none';
        }
        else {
            doc.body.style.userSelect = 'auto';
        }
    }, [doc.body.style]);
    const toggleCursor = react_1.default.useCallback((direction) => {
        if (!direction) {
            doc.body.style.cursor = 'auto';
            return;
        }
        function computeCursor(direction) {
            switch (direction) {
                case "top":
                    return 'row-resize';
                case "bottom":
                    return 'row-resize';
                case "left":
                    return 'col-resize';
                case "right":
                    return 'col-resize';
            }
        }
        doc.body.style.cursor = computeCursor(direction);
    }, [doc.body.style]);
    const updatePosition = react_1.default.useCallback((position, direction) => {
        setPosition(position);
        if (props.onResized) {
            props.onResized(position, direction);
        }
    }, [props]);
    const handleMouseUp = react_1.default.useCallback(() => {
        mouseDown.current = false;
        toggleUserSelect(false);
        toggleCursor(undefined);
        win.removeEventListener('mousemove', mouseMoveHandler.current);
    }, [toggleCursor, toggleUserSelect, win]);
    const handleMouseMove = react_1.default.useCallback((event, direction) => {
        if (!mouseDown.current) {
            return;
        }
        const origin = mouseEventOrigin.current;
        const delta = {
            x: event.clientX - origin.x,
            y: event.clientY - origin.y
        };
        function computeResizingPosition() {
            switch (direction) {
                case "top":
                    return Object.assign(Object.assign({}, resizingPositionRef.current), { top: Math.min(resizingPositionRef.current.top + delta.y, resizingPositionRef.current.top + resizingPositionRef.current.height), height: Math.max(resizingPositionRef.current.height - delta.y, 0) });
                case "bottom":
                    return Object.assign(Object.assign({}, resizingPositionRef.current), { height: resizingPositionRef.current.height + delta.y });
                case "left":
                    return Object.assign(Object.assign({}, resizingPositionRef.current), { left: Math.min(resizingPositionRef.current.left + delta.x, resizingPositionRef.current.left + resizingPositionRef.current.width), width: Math.max(resizingPositionRef.current.width - delta.x, 0) });
                case "right":
                    return Object.assign(Object.assign({}, resizingPositionRef.current), { width: resizingPositionRef.current.width + delta.x });
            }
        }
        function computePosition() {
            const resizingPosition = computeResizingPosition();
            if (props.bounds) {
                const boundsParentElementRect = computeBoundsParentElementRect();
                const boundedLTRB = {
                    left: Math.max(resizingPosition.left, 0),
                    top: Math.max(resizingPosition.top, 0),
                    right: Math.min(resizingPosition.left + resizingPosition.width, boundsParentElementRect.width),
                    bottom: Math.min(resizingPosition.top + resizingPosition.height, boundsParentElementRect.height)
                };
                return ILTBRRects_1.ILTBRRects.toLTRect(boundedLTRB);
            }
            return resizingPosition;
        }
        resizingPositionRef.current = computeResizingPosition();
        updatePosition(computePosition(), direction);
        mouseEventOrigin.current = event;
    }, [computeBoundsParentElementRect, props.bounds, updatePosition]);
    const handleMouseDown = react_1.default.useCallback((event, direction) => {
        mouseDown.current = true;
        mouseEventOrigin.current = { x: event.clientX, y: event.clientY };
        toggleUserSelect(true);
        toggleCursor(direction);
        mouseMoveHandler.current = (event) => handleMouseMove(event, direction);
        win.addEventListener('mousemove', mouseMoveHandler.current);
        win.addEventListener('mouseup', () => {
            handleMouseUp();
        }, { once: true });
    }, [handleMouseMove, handleMouseUp, toggleCursor, toggleUserSelect, win]);
    const style = {
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        overflow: 'none'
    };
    return (react_1.default.createElement("div", { id: props.id, style: Object.assign(Object.assign({}, style), props.style), ref: ref => elementRef.current = ref, draggable: false, className: props.className, onContextMenu: props.onContextMenu },
        react_1.default.createElement(VerticalLine_1.VerticalLine, { side: "left", color: props.color, height: position.height, onMouseDown: event => handleMouseDown(event, 'left'), onMouseUp: handleMouseUp }),
        react_1.default.createElement(VerticalLine_1.VerticalLine, { side: "right", color: props.color, height: position.height, onMouseDown: event => handleMouseDown(event, 'right'), onMouseUp: handleMouseUp }),
        react_1.default.createElement(HorizontalLine_1.HorizontalLine, { side: "top", color: props.color, width: position.width, onMouseDown: event => handleMouseDown(event, 'top'), onMouseUp: handleMouseUp }),
        react_1.default.createElement(HorizontalLine_1.HorizontalLine, { side: "bottom", color: props.color, width: position.width, onMouseDown: event => handleMouseDown(event, 'bottom'), onMouseUp: handleMouseUp })));
});
var HTMLElements;
(function (HTMLElements) {
    function findPositionedAncestor(element) {
        if (element.style.position !== null && element.style.position !== 'static') {
            return element;
        }
        if (element.parentElement) {
            return findPositionedAncestor(element.parentElement);
        }
        return undefined;
    }
    HTMLElements.findPositionedAncestor = findPositionedAncestor;
    function computeOffset(parent, child) {
        const parentBCR = parent.getBoundingClientRect();
        const childBCR = child.getBoundingClientRect();
        const x = childBCR.x - parentBCR.x;
        const y = childBCR.y - parentBCR.y;
        return { x, y };
    }
    HTMLElements.computeOffset = computeOffset;
})(HTMLElements = exports.HTMLElements || (exports.HTMLElements = {}));
//# sourceMappingURL=Resizable.js.map