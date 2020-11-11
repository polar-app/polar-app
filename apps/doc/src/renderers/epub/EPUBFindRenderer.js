"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBFindRenderer = void 0;
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const DOMHighlights_1 = require("../../../../../web/js/dom_highlighter/DOMHighlights");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const EPUBFinderStore_1 = require("./EPUBFinderStore");
const EPUBFinders_1 = require("./EPUBFinders");
exports.EPUBFindRenderer = ReactUtils_1.memoForwardRef(() => {
    const { hits, current } = EPUBFinderStore_1.useEPUBFinderStore(['hits', 'current']);
    const epubRoot = EPUBFinders_1.useEPUBRoot();
    if (hits === undefined || current === undefined) {
        return null;
    }
    return react_dom_1.default.createPortal(react_1.default.createElement(DOMHighlights_1.DOMHighlights, { hits: hits }), epubRoot.root);
});
//# sourceMappingURL=EPUBFindRenderer.js.map