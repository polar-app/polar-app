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
exports.MUIMenuSection = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../react/ReactUtils");
const MUIMenuSubheader_1 = require("./MUIMenuSubheader");
function toArray(children) {
    return Array.isArray(children) ? children : [children];
}
exports.MUIMenuSection = ReactUtils_1.deepMemo((props) => {
    const children = toArray(props.children)
        .filter(current => current !== false);
    if (children.length === 0) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(MUIMenuSubheader_1.MUIMenuSubheader, null, props.title),
        props.children));
});
//# sourceMappingURL=MUIMenuSection.js.map