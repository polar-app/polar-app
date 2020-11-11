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
exports.FadeBlackout = void 0;
const React = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const Functions_1 = require("polar-shared/src/util/Functions");
exports.FadeBlackout = (props) => {
    const positioning = Object.assign({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }, (props.style || {}));
    const style = Object.assign(Object.assign({ backgroundColor: 'rgba(0, 0, 0)' }, positioning), (props.style || {}));
    const onClick = props.onClick || Functions_1.NULL_FUNCTION;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: Object.assign(Object.assign({}, positioning), { backdropFilter: 'blur(5px)' }) }),
        React.createElement(framer_motion_1.motion.div, { initial: {
                opacity: 0.0
            }, animate: {
                opacity: 0.7
            }, exit: {
                opacity: 0
            }, style: style, onClick: () => onClick() })));
};
//# sourceMappingURL=FadeBlackout.js.map