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
exports.AnnotationInlineControlBar = void 0;
const React = __importStar(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const OpenInNew_1 = __importDefault(require("@material-ui/icons/OpenInNew"));
const AnnotationRepoStore_1 = require("./AnnotationRepoStore");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const MUIButtonBar_1 = require("../../../../web/js/mui/MUIButtonBar");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const MUITooltip_1 = require("../../../../web/js/mui/MUITooltip");
exports.AnnotationInlineControlBar = ReactUtils_1.deepMemo((props) => {
    var _a;
    const { annotation } = props;
    const callbacks = AnnotationRepoStore_1.useAnnotationRepoCallbacks();
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: {
                display: 'flex',
                alignItems: "center"
            }, className: "p-1" },
            React.createElement("div", { style: {} }, ((_a = annotation.docInfo) === null || _a === void 0 ? void 0 : _a.title) || 'Untitled'),
            React.createElement(MUIButtonBar_1.MUIButtonBar, { style: {
                    alignItems: 'center',
                    flexGrow: 1,
                    justifyContent: "flex-end"
                } },
                React.createElement(MUITooltip_1.MUITooltip, { title: "Open document" },
                    React.createElement(IconButton_1.default, { onClick: () => callbacks.doOpen(annotation === null || annotation === void 0 ? void 0 : annotation.docInfo) },
                        React.createElement(OpenInNew_1.default, null))))),
        React.createElement(Divider_1.default, null)));
});
//# sourceMappingURL=AnnotationInlineControlBar.js.map