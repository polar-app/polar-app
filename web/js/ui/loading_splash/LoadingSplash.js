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
exports.LoadingSplash = void 0;
const React = __importStar(require("react"));
const SplashBox_1 = require("./SplashBox");
const PolarSVGIcon_1 = require("../svg_icons/PolarSVGIcon");
function LoadingSplash() {
    return (React.createElement(SplashBox_1.SplashBox, null,
        React.createElement("div", { className: "logo" },
            React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 250, height: 250 }))));
}
exports.LoadingSplash = LoadingSplash;
//# sourceMappingURL=LoadingSplash.js.map