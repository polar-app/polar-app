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
exports.Sidebar = void 0;
const React = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const FadeBlackout_1 = require("./FadeBlackout");
const zIndex = 3000000;
exports.Sidebar = (props) => {
    const computeWidth = () => {
        return props.fullscreen ? window.screen.width : (props.width || 350);
    };
    const width = computeWidth();
    const style = Object.assign({ position: 'absolute', top: 0, width: `${width}px`, height: '100%', backgroundColor: 'var(--primary-background-color)', color: 'var(--primary-text-color)', zIndex }, props.style || {});
    const inactiveWidth = 1 * (width * 0.7);
    return (React.createElement(React.Fragment, null,
        React.createElement(FadeBlackout_1.FadeBlackout, { style: { zIndex: zIndex - 1 }, onClick: () => props.onClose() }),
        React.createElement(framer_motion_1.motion.div, { className: `right-sidebar ${props.borderBarClassName}`, initial: {
                opacity: 0.0,
                right: inactiveWidth
            }, animate: {
                opacity: 1.0,
                right: 0
            }, exit: {
                opacity: 0.0,
                right: inactiveWidth
            }, style: style }, props.children)));
};
//# sourceMappingURL=Sidebar.js.map