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
exports.AnnotationRepoFilterBar2 = void 0;
const AnnotationTypeSelector_1 = require("./filter_bar/controls/annotation_type/AnnotationTypeSelector");
const HighlightColorFilterButton_1 = require("./filter_bar/controls/color/HighlightColorFilterButton");
const React = __importStar(require("react"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const AnnotationRepoTableDropdown2_1 = require("./AnnotationRepoTableDropdown2");
const TextFilter2_1 = require("./filter_bar/TextFilter2");
exports.AnnotationRepoFilterBar2 = () => {
    const { filter } = AnnotationRepoStore_1.useAnnotationRepoStore(['filter']);
    const callbacks = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    const { setFilter } = callbacks;
    return (React.createElement("div", { style: { display: 'flex' } },
        React.createElement("div", { className: "mr-1 mt-auto mb-auto" },
            React.createElement(AnnotationTypeSelector_1.AnnotationTypeSelector, { selected: filter.annotationTypes || [], onSelected: annotationTypes => setFilter({ annotationTypes }) })),
        React.createElement("div", { className: "mr-1 mt-auto mb-auto" },
            React.createElement(HighlightColorFilterButton_1.HighlightColorFilterButton, { selected: filter.colors, onSelected: colors => setFilter({ colors }) })),
        React.createElement("div", { className: "ml-1 d-none-mobile mt-auto mb-auto" },
            React.createElement(TextFilter2_1.TextFilter2, { onChange: text => setFilter({ text }) })),
        React.createElement("div", { className: "ml-1 d-none-mobile mt-auto mb-auto" },
            React.createElement(AnnotationRepoTableDropdown2_1.AnnotationRepoTableDropdown2, { onExport: callbacks.onExport }))));
};
//# sourceMappingURL=AnnotationRepoFilterBar2.js.map