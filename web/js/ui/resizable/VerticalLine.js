"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalLine = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
exports.VerticalLine = ReactUtils_1.deepMemo((props) => {
    const position = props.side === 'left' ? { left: '0px' } : { right: '0px' };
    const style = Object.assign({ position: 'absolute', width: '5px', height: `${props.height}px`, backgroundColor: props.color, cursor: 'col-resize' }, position);
    return (react_1.default.createElement("div", { style: style, draggable: false, onMouseDown: props.onMouseDown, onMouseUp: props.onMouseUp }));
});
//# sourceMappingURL=VerticalLine.js.map