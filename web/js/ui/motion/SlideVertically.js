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
exports.SlideVertically = void 0;
const React = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
exports.SlideVertically = (props) => {
    const style = Object.assign({ position: 'absolute', width: '100%' }, props.style || {});
    return (React.createElement(framer_motion_1.motion.div, { initial: {
            opacity: 0.0,
            transform: `translateY(${props.initialY}%)`
        }, animate: {
            opacity: 1.0,
            transform: `translateY(${props.targetY}%)`
        }, exit: {
            opacity: 0.0,
            transform: `translateY(${props.initialY}%)`
        }, style: style }, props.children));
};
//# sourceMappingURL=SlideVertically.js.map