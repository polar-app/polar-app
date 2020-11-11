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
exports.FixedHeightImg = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../react/ReactUtils");
exports.FixedHeightImg = ReactUtils_1.deepMemo((props) => {
    const { img, id, color } = props;
    if (img) {
        const height = Math.floor(img.height);
        return (React.createElement("div", { className: "area-highlight m-1", "data-annotation-id": id, "data-annotation-color": color, style: {
                display: 'block',
                textAlign: 'center',
                position: 'relative'
            } },
            React.createElement("img", { style: {
                    height,
                    objectFit: 'cover',
                    objectPosition: '50% top',
                    maxHeight: height,
                    boxSizing: 'content-box',
                }, draggable: false, className: "", height: height, alt: "screenshot", src: img.src })));
    }
    else {
        return (React.createElement("div", null, props.defaultText || 'No image'));
    }
});
//# sourceMappingURL=FixedHeightImg.js.map