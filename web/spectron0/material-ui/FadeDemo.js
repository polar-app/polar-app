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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FadeDemo = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Fade_1 = __importDefault(require("@material-ui/core/Fade"));
exports.FadeDemo = () => {
    const [active, setActive] = react_1.useState(false);
    return (React.createElement(React.Fragment, null,
        React.createElement(Button_1.default, { variant: "contained", onClick: () => setActive(!active) }, "toggle"),
        React.createElement(Fade_1.default, { timeout: 1000, in: active },
            React.createElement("div", null, " this is the faded content"))));
};
//# sourceMappingURL=FadeDemo.js.map