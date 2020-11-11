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
exports.ColorSelector = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const ColorSelectorBox_1 = require("./ColorSelectorBox");
const MUIPopper_1 = require("../../mui/menu/MUIPopper");
const Palette_1 = __importDefault(require("@material-ui/icons/Palette"));
const ReactUtils_1 = require("../../react/ReactUtils");
const ColorSelectorInner = ReactUtils_1.deepMemo((props) => {
    const popperController = MUIPopper_1.usePopperController();
    const handleSelected = React.useCallback((color) => {
        props.onColor(color);
        popperController.dismiss();
    }, [popperController, props]);
    return (React.createElement(ColorSelectorBox_1.ColorSelectorBox, { selected: [props.color], onSelected: handleSelected }));
});
exports.ColorSelector = ReactUtils_1.deepMemo((props) => {
    const onSelected = props.onSelected || Functions_1.NULL_FUNCTION;
    const [color, setColor] = React.useState(props.color);
    const handleSelected = React.useCallback((color) => {
        setColor(color);
        onSelected(color);
    }, [onSelected]);
    return (React.createElement(MUIPopper_1.MUIPopper, { size: "small", icon: React.createElement(Palette_1.default, null) },
        React.createElement("div", null,
            React.createElement(ColorSelectorInner, { color: color, onColor: handleSelected }))));
});
//# sourceMappingURL=ColorSelector.js.map