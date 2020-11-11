"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMHighlights = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const DOMHighlight_1 = require("./DOMHighlight");
exports.DOMHighlights = ReactUtils_1.memoForwardRef((props) => {
    function toDOMHighlight(hit) {
        return react_1.default.createElement(DOMHighlight_1.DOMHighlight, Object.assign({ key: hit.id }, hit));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null, props.hits.map(toDOMHighlight)));
});
//# sourceMappingURL=DOMHighlights.js.map