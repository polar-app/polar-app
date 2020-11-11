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
exports.ColorSelectorBox = void 0;
const React = __importStar(require("react"));
const ColorButton_1 = require("./ColorButton");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const ReactUtils_1 = require("../../react/ReactUtils");
const ColorButtonsRow = (props) => {
    const selected = props.selected || [];
    return React.createElement("div", { style: { display: 'flex' } }, props.colors.map(color => React.createElement(ColorButton_1.ColorButton, { key: color, selected: selected.includes(color), onSelected: props.onSelected, color: color })));
};
const ColorButtonsRow0 = (props) => {
    const colors = ['yellow', 'red', 'green', '#9900EF', '#FF6900'];
    return React.createElement(ColorButtonsRow, Object.assign({}, props, { colors: colors }));
};
const ColorButtonsRow1 = (props) => {
    const colors = ['#8DFF76', '#00D084', '#8ED1FC', '#0693E3', '#EB144C'];
    return React.createElement(ColorButtonsRow, Object.assign({}, props, { colors: colors }));
};
const ColorButtonsRow2 = (props) => {
    const colors = ['#F78DA7', '#FFFF00', '#F96676', '#FCB900', '#7BDCB5'];
    return React.createElement(ColorButtonsRow, Object.assign({}, props, { colors: colors }));
};
const ColorButtons = (props) => {
    return (React.createElement(Box_1.default, { pt: 1, pb: 1 },
        React.createElement(ColorButtonsRow0, Object.assign({}, props)),
        React.createElement(Box_1.default, { mt: 1 },
            React.createElement(ColorButtonsRow1, Object.assign({}, props))),
        React.createElement(Box_1.default, { mt: 1 },
            React.createElement(ColorButtonsRow2, Object.assign({}, props)))));
};
exports.ColorSelectorBox = ReactUtils_1.deepMemo((props) => {
    return (React.createElement("div", null,
        React.createElement(ColorButtons, Object.assign({}, props))));
});
//# sourceMappingURL=ColorSelectorBox.js.map