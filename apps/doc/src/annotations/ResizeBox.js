"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeBox = void 0;
const react_rnd_1 = require("react-rnd");
const React = __importStar(require("react"));
const react_1 = require("react");
const Functions_1 = require("polar-shared/src/util/Functions");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const WindowHooks_1 = require("../../../../web/js/react/WindowHooks");
const ScrollIntoViewUsingLocation_1 = require("./ScrollIntoViewUsingLocation");
function deriveStateFromInitialPosition(computeInitialPosition) {
    const initialPosition = computeInitialPosition();
    return {
        active: true,
        x: initialPosition.left,
        y: initialPosition.top,
        width: initialPosition.width,
        height: initialPosition.height
    };
}
function computeNewBox(box, direction, delta) {
    if (direction.startsWith('left') || direction.startsWith('top')) {
        return {
            x: box.x - delta.width,
            width: box.width + delta.width,
            y: box.y - delta.height,
            height: box.height + delta.height
        };
    }
    if (direction.startsWith('right') || direction.startsWith('bottom')) {
        return {
            x: box.x,
            y: box.y,
            width: box.width + delta.width,
            height: box.height + delta.height
        };
    }
    throw new Error("unhandled direction: " + direction);
}
exports.ResizeBox = ReactUtils_1.deepMemo((props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const computeNewState = () => deriveStateFromInitialPosition(props.computePosition);
    const [state, setState] = react_1.useState(computeNewState);
    const scrollIntoViewRef = ScrollIntoViewUsingLocation_1.useScrollIntoViewUsingLocation();
    const rndRef = React.useRef(null);
    WindowHooks_1.useWindowResizeEventListener(() => {
        setState(computeNewState());
    }, { win: props.window });
    const handleRndRef = React.useCallback((rnd) => {
        rndRef.current = rnd;
        scrollIntoViewRef(rndRef.current ? rndRef.current.getSelfElement() : null);
    }, [scrollIntoViewRef]);
    const handleResize = React.useCallback((newState, direction) => {
        function computeStateWithAxisHandling() {
            if (props.resizeAxis === 'y') {
                return {
                    active: newState.active,
                    x: state.x,
                    y: newState.y,
                    width: state.width,
                    height: newState.height
                };
            }
            return newState;
        }
        newState = computeStateWithAxisHandling();
        setState(newState);
        try {
            const onResized = props.onResized || Functions_1.NULL_FUNCTION;
            const newPosition = onResized({
                left: newState.x,
                top: newState.y,
                width: newState.width,
                height: newState.height
            }, direction);
            if (newPosition) {
                setState(Object.assign(Object.assign({}, state), newPosition));
            }
        }
        catch (e) {
            console.error(e);
        }
    }, [props.onResized, props.resizeAxis, state]);
    const resizeHandleStyle = Object.assign({ pointerEvents: 'auto' }, (props.resizeHandleStyle || {}));
    const handleOnMouseOver = () => {
        setState(Object.assign(Object.assign({}, state), { active: true }));
    };
    const handleOnMouseOut = () => {
        setState(Object.assign(Object.assign({}, state), { active: false }));
    };
    const dataProps = Dictionaries_1.Dictionaries.filter(props, key => key.startsWith('data-'));
    const outlineSize = 5;
    const outlineSizePX = `${outlineSize}px`;
    const resizeStyles = {
        vertical: {
            width: outlineSizePX
        },
        horizontal: {
            height: outlineSizePX
        },
        corner: {
            width: outlineSizePX,
            height: outlineSizePX
        }
    };
    function computePosition(state) {
        return { x: state.x, y: state.y };
    }
    const position = computePosition(state);
    const doc = props.document || document;
    const toggleUserSelect = (resizing) => {
        if (resizing) {
            doc.body.style.userSelect = 'none';
        }
        else {
            doc.body.style.userSelect = 'auto';
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(react_rnd_1.Rnd, Object.assign({ ref: handleRndRef, id: props.id, bounds: props.bounds || "parent", className: props.className, size: {
                width: state.width,
                height: state.height
            }, onMouseDown: () => toggleUserSelect(true), onMouseUp: () => toggleUserSelect(false), position: position, onDragStop: (e, d) => {
            }, onResizeStop: (event, direction, elementRef, delta) => {
                const box = computeNewBox(state, direction, delta);
                handleResize(Object.assign(Object.assign({}, state), box), direction);
            }, disableDragging: true, enableResizing: props.enableResizing, resizeHandleStyles: {
                top: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_a = props.resizeHandleStyles) === null || _a === void 0 ? void 0 : _a.top), resizeStyles.horizontal), { top: '0px' }),
                bottom: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_b = props.resizeHandleStyles) === null || _b === void 0 ? void 0 : _b.bottom), resizeStyles.horizontal), { bottom: '0px' }),
                left: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_c = props.resizeHandleStyles) === null || _c === void 0 ? void 0 : _c.left), resizeStyles.vertical), { left: '0px' }),
                right: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_d = props.resizeHandleStyles) === null || _d === void 0 ? void 0 : _d.right), resizeStyles.vertical), { right: '0px' }),
                topLeft: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_e = props.resizeHandleStyles) === null || _e === void 0 ? void 0 : _e.topLeft), resizeStyles.corner), { top: `0px`, left: `0px` }),
                topRight: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_f = props.resizeHandleStyles) === null || _f === void 0 ? void 0 : _f.topRight), resizeStyles.corner), { top: `0px`, right: `0px` }),
                bottomLeft: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_g = props.resizeHandleStyles) === null || _g === void 0 ? void 0 : _g.bottomLeft), resizeStyles.corner), { bottom: `0px`, left: `0px` }),
                bottomRight: Object.assign(Object.assign(Object.assign(Object.assign({}, resizeHandleStyle), (_h = props.resizeHandleStyles) === null || _h === void 0 ? void 0 : _h.bottomRight), resizeStyles.corner), { bottom: `0px`, right: `0px` }),
            }, style: Object.assign(Object.assign({}, props.style), { pointerEvents: 'none' }) }, dataProps))));
});
//# sourceMappingURL=ResizeBox.js.map