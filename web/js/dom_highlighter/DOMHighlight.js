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
exports.DOMHighlight = void 0;
const ReactUtils_1 = require("../react/ReactUtils");
const React = __importStar(require("react"));
const WindowHooks_1 = require("../react/WindowHooks");
const DOMHighlightRow_1 = require("./DOMHighlightRow");
const Highlights_1 = require("./Highlights");
const AnimationFrameDebouncers_1 = require("./AnimationFrameDebouncers");
var withAnimationFrame = AnimationFrameDebouncers_1.AnimationFrameDebouncers.withAnimationFrame;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
function toHighlightViewportPositions(regions) {
    try {
        return Highlights_1.Highlights.toHighlightViewportPositions(regions);
    }
    catch (e) {
        console.error("Unable to handle viewport position: ", e);
        return undefined;
    }
}
exports.DOMHighlight = ReactUtils_1.deepMemo((props) => {
    const { regions } = props;
    const [highlightViewportPositions, setHighlightViewportPositions] = React.useState(toHighlightViewportPositions(regions));
    const redrawCallback = React.useMemo(() => withAnimationFrame(() => {
        setHighlightViewportPositions(toHighlightViewportPositions(regions));
    }), [regions]);
    if (props.regions.length === 0) {
        return null;
    }
    function computeWindow() {
        return props.regions[0].node.ownerDocument.defaultView;
    }
    const win = computeWindow();
    WindowHooks_1.useWindowScrollEventListener(redrawCallback, { win });
    WindowHooks_1.useWindowResizeEventListener(redrawCallback, { win });
    WindowHooks_1.useWindowScrollEventListener(redrawCallback);
    WindowHooks_1.useWindowResizeEventListener(redrawCallback);
    const dataAttributes = Dictionaries_1.Dictionaries.dataAttributes(props);
    function toDOMHighlighterRow(highlightViewportPosition, idx) {
        const id = idx === 0 ? props.id : (props.id + ":" + idx);
        const key = `${highlightViewportPosition.nodeID}:${highlightViewportPosition.start}:${highlightViewportPosition.end}`;
        return React.createElement(DOMHighlightRow_1.DOMHighlightRow, Object.assign({}, highlightViewportPosition, dataAttributes, { color: props.color, className: props.className, id: id, key: key }));
    }
    if (highlightViewportPositions === undefined) {
        return null;
    }
    return (React.createElement(React.Fragment, null, highlightViewportPositions.map(toDOMHighlighterRow)));
});
//# sourceMappingURL=DOMHighlight.js.map