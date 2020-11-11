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
exports.MUITooltip = exports.TOOLTIP_ENTER_DELAY = exports.TOOLTIP_LEAVE_DELAY = void 0;
const React = __importStar(require("react"));
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
exports.TOOLTIP_LEAVE_DELAY = 750;
exports.TOOLTIP_ENTER_DELAY = 200;
exports.MUITooltip = React.memo((props) => {
    if (props.title === undefined) {
        return props.children;
    }
    return (React.createElement(Tooltip_1.default, { title: props.title, arrow: true, enterDelay: exports.TOOLTIP_ENTER_DELAY, leaveDelay: exports.TOOLTIP_ENTER_DELAY }, props.children));
});
//# sourceMappingURL=MUITooltip.js.map