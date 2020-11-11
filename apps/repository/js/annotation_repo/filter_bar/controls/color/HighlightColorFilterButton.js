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
exports.HighlightColorFilterButton = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const Palette_1 = __importDefault(require("@material-ui/icons/Palette"));
const MUIPopper_1 = require("../../../../../../../web/js/mui/menu/MUIPopper");
const ResetableColorSelectorBox_1 = require("../../../../../../../web/js/ui/colors/ResetableColorSelectorBox");
const ReactUtils_1 = require("../../../../../../../web/js/react/ReactUtils");
const ClickAwayListener_1 = __importDefault(require("@material-ui/core/ClickAwayListener"));
const ColorSelector = ReactUtils_1.deepMemo((props) => {
    const popperController = MUIPopper_1.usePopperController();
    const onSelected = props.onSelected || Functions_1.NULL_FUNCTION;
    const handleSelected = React.useCallback((color) => {
        const selected = props.selected || [];
        const newSelected = selected.includes(color) ?
            selected.filter(current => current !== color) :
            [...selected, color];
        onSelected(newSelected);
    }, [onSelected, props.selected]);
    const handleReset = React.useCallback(() => {
        onSelected([]);
        popperController.dismiss();
    }, [onSelected, popperController]);
    return (React.createElement(ClickAwayListener_1.default, { onClickAway: popperController.dismiss },
        React.createElement("div", null,
            React.createElement(ResetableColorSelectorBox_1.ResetableColorSelectorBox, { selected: props.selected, onReset: handleReset, onSelected: handleSelected }))));
});
exports.HighlightColorFilterButton = ReactUtils_1.deepMemo((props) => {
    return (React.createElement("div", { className: props.className || '', style: props.style },
        React.createElement(MUIPopper_1.MUIPopper, { variant: "outlined", style: {
                whiteSpace: 'nowrap'
            }, size: "small", caret: true, text: "Colors", icon: React.createElement(Palette_1.default, null) },
            React.createElement(ColorSelector, Object.assign({}, props)))));
});
//# sourceMappingURL=HighlightColorFilterButton.js.map