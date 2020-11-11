"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMHighlightRow = void 0;
const react_1 = __importDefault(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
const Highlights_1 = require("./Highlights");
const ScrollIntoViewUsingLocation_1 = require("../../../apps/doc/src/annotations/ScrollIntoViewUsingLocation");
var intersectsWithWindow = Highlights_1.Highlights.intersectsWithWindow;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
exports.DOMHighlightRow = ReactUtils_1.deepMemo((props) => {
    const scrollIntoViewRef = ScrollIntoViewUsingLocation_1.useScrollIntoViewUsingLocation();
    const useMinimalUI = !intersectsWithWindow(props);
    const absolutePosition = Highlights_1.Highlights.fixedToAbsolute(props);
    const backgroundColor = props.color || 'rgba(255, 255, 0, 0.5)';
    if (useMinimalUI) {
        return (react_1.default.createElement("div", { id: props.id, ref: scrollIntoViewRef, className: props.className, style: Object.assign({ position: 'absolute' }, absolutePosition) }));
    }
    else {
        const dataAttributes = Dictionaries_1.Dictionaries.dataAttributes(props);
        return (react_1.default.createElement("div", Object.assign({ id: props.id, ref: scrollIntoViewRef }, dataAttributes, { className: "polar-ui " + props.className || '', style: Object.assign({ backgroundColor: `${backgroundColor}`, position: 'absolute', pointerEvents: 'none', mixBlendMode: 'overlay' }, absolutePosition) })));
    }
});
//# sourceMappingURL=DOMHighlightRow.js.map