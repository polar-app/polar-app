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
exports.EditButton = void 0;
const React = __importStar(require("react"));
const Analytics_1 = require("../../analytics/Analytics");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Edit_1 = __importDefault(require("@material-ui/icons/Edit"));
const ReactUtils_1 = require("../../react/ReactUtils");
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
exports.EditButton = ReactUtils_1.deepMemo((props) => {
    const theme = useTheme_1.default();
    function onClick() {
        Analytics_1.Analytics.event({ category: 'annotation-edit', action: props.type });
        props.onClick();
    }
    return (React.createElement(IconButton_1.default, { id: props.id, size: "small", style: { color: theme.palette.text.secondary }, disabled: props.disabled, title: 'Edit ' + props.type, onClick: () => onClick() },
        React.createElement(Edit_1.default, null)));
});
//# sourceMappingURL=EditButton.js.map