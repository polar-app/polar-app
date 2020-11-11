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
exports.CloseIcon = exports.EnvelopeIcon = exports.SortIcon = exports.DeleteIcon = exports.TagIcon = exports.FolderIcon = exports.FolderMinusIcon = exports.FilterIcon = exports.SearchIcon = exports.TimesIcon = exports.PlusIcon = exports.CommentIcon = void 0;
const React = __importStar(require("react"));
const FixedWidthIcon_1 = require("./FixedWidthIcon");
exports.CommentIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-comment-alt" });
exports.PlusIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-plus" });
exports.TimesIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-times" });
exports.SearchIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-search" });
exports.FilterIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-filter" });
exports.FolderMinusIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-folder-minus" });
exports.FolderIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-folder-plus" });
exports.TagIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-tag" });
exports.DeleteIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-trash" });
exports.SortIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fal fa-sort-alt" });
exports.EnvelopeIcon = () => React.createElement(FixedWidthIcon_1.FixedWidthIcon, { name: "fas fa-envelope" });
exports.CloseIcon = exports.TimesIcon;
//# sourceMappingURL=FixedWidthIcons.js.map