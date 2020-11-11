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
const ControlBar = (props) => (React.createElement("div", { style: {
        position: 'absolute',
        top: `calc(${props.top}px - 2.5em)`,
        left: props.left,
        width: props.width,
        height: '1.5em',
        display: 'flex',
        zIndex: 1,
    } },
    React.createElement("div", { className: "ml-auto mr-auto" },
        React.createElement("div", { className: "border rounded p-1 pl-2 pr-2", style: {
                backgroundColor: 'var(--grey100)'
            } }, "this is the control bar!"))));
function ResizeBox(props) {
    const [state, setState] = react_1.useState({
        active: false,
        x: 10,
        y: 75,
        width: 300,
        height: 300
    });
    const resizeHandleStyle = {
        pointerEvents: 'auto'
    };
    const handleOnMouseOver = () => {
        setState(Object.assign(Object.assign({}, state), { active: true }));
    };
    const handleOnMouseOut = () => {
        setState(Object.assign(Object.assign({}, state), { active: false }));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ControlBar, { top: state.y, left: state.x, width: state.width }),
        React.createElement(react_rnd_1.Rnd, { size: { width: state.width, height: state.height }, position: { x: state.x, y: state.y }, onMouseOver: () => handleOnMouseOver(), onMouseOut: () => handleOnMouseOut(), onDragStop: (e, d) => {
                setState(Object.assign(Object.assign({}, state), { x: d.x, y: d.y }));
            }, onResizeStop: (e, direction, ref, delta, position) => {
                const width = parseInt(ref.style.width);
                const height = parseInt(ref.style.height);
                setState(Object.assign(Object.assign(Object.assign({}, state), { width,
                    height }), position));
            }, disableDragging: true, resizeHandleStyles: {
                bottom: resizeHandleStyle,
                bottomLeft: resizeHandleStyle,
                bottomRight: resizeHandleStyle,
                top: resizeHandleStyle,
                topLeft: resizeHandleStyle,
                topRight: resizeHandleStyle,
                left: resizeHandleStyle,
                right: resizeHandleStyle
            }, style: {
                backgroundColor: 'rgba(0, 0, 255, 0.6)',
                mixBlendMode: 'multiply',
                pointerEvents: 'none',
                display: 'flex'
            } })));
}
exports.ResizeBox = ResizeBox;
//# sourceMappingURL=ResizeBox.js.map