"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorizontalLine = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
exports.HorizontalLine = ReactUtils_1.deepMemo((props) => {
    const position = props.side === 'top' ? { top: '0px' } : { bottom: '0px' };
    const style = Object.assign({ position: 'absolute', height: '5px', width: `${props.width}px`, backgroundColor: props.color, cursor: 'row-resize' }, position);
    return (react_1.default.createElement("div", { style: style, draggable: false, onMouseDown: props.onMouseDown, onMouseUp: props.onMouseUp }));
});
//# sourceMappingURL=HorizontalLine.js.map