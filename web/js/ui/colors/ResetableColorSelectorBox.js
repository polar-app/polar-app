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
exports.ResetableColorSelectorBox = void 0;
const React = __importStar(require("react"));
const ColorSelectorBox_1 = require("./ColorSelectorBox");
const ReactUtils_1 = require("../../react/ReactUtils");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
exports.ResetableColorSelectorBox = ReactUtils_1.deepMemo((props) => {
    return (React.createElement("div", null,
        React.createElement(ColorSelectorBox_1.ColorSelectorBox, { selected: props.selected, onSelected: props.onSelected }),
        React.createElement(Box_1.default, { pb: 1, style: { display: 'flex' } },
            React.createElement(Button_1.default, { onClick: props.onReset, style: {
                    marginLeft: 'auto', marginRight: 'auto'
                }, variant: "contained" }, "Reset"))));
});
//# sourceMappingURL=ResetableColorSelectorBox.js.map