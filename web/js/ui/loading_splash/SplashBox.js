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
exports.SplashBox = void 0;
const React = __importStar(require("react"));
function SplashBox(props) {
    return (React.createElement("div", { id: props.id, style: {
            display: 'flex',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000000
        } },
        React.createElement("div", { style: {
                margin: 'auto',
                paddingTop: props.paddingTop
            } }, props.children)));
}
exports.SplashBox = SplashBox;
//# sourceMappingURL=SplashBox.js.map