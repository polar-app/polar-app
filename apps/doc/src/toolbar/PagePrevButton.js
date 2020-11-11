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
exports.PagePrevButton = void 0;
const React = __importStar(require("react"));
const DocViewerStore_1 = require("../DocViewerStore");
const ArrowUpward_1 = __importDefault(require("@material-ui/icons/ArrowUpward"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
exports.PagePrevButton = React.memo(() => {
    const { onPagePrev } = DocViewerStore_1.useDocViewerCallbacks();
    const { pageNavigator, page } = DocViewerStore_1.useDocViewerStore(['pageNavigator', 'page']);
    return (React.createElement(IconButton_1.default, { disabled: !pageNavigator || page <= 1, onClick: onPagePrev },
        React.createElement(ArrowUpward_1.default, null)));
});
//# sourceMappingURL=PagePrevButton.js.map