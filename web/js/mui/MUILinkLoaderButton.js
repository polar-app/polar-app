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
exports.MUILinkLoaderButton = void 0;
const React = __importStar(require("react"));
const LinkLoaderHook_1 = require("../ui/util/LinkLoaderHook");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ReactUtils_1 = require("../react/ReactUtils");
exports.MUILinkLoaderButton = ReactUtils_1.deepMemo((props) => {
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const handleClick = React.useCallback(() => {
        linkLoader(props.href, { newWindow: true, focus: true });
    }, [linkLoader, props]);
    return (React.createElement(Button_1.default, { variant: props.variant, color: props.color, size: props.size, onClick: handleClick }, props.children));
});
//# sourceMappingURL=MUILinkLoaderButton.js.map