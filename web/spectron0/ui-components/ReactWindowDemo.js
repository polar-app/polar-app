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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactWindowDemo = void 0;
const React = __importStar(require("react"));
const react_window_1 = require("react-window");
const react_virtualized_auto_sizer_1 = __importDefault(require("react-virtualized-auto-sizer"));
const rowHeights = new Array(1000)
    .fill(true)
    .map(() => 25 + Math.round(Math.random() * 50));
const getItemSize = (index) => {
    const id = 'row:' + index;
    console.log(`FIXME: checking if it exists: ${id}`, document.getElementById(id));
    return rowHeights[index];
};
const Row = (props) => (React.createElement("div", { style: props.style, id: 'row:' + props.index },
    "Row ",
    props.index));
exports.ReactWindowDemo = () => (React.createElement(react_virtualized_auto_sizer_1.default, null, size => (React.createElement(react_window_1.VariableSizeList, { height: size.height, itemCount: 1000, itemSize: getItemSize, width: size.width }, Row))));
//# sourceMappingURL=ReactWindowDemo.js.map