"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerToolbarOverflowButton = void 0;
const react_1 = __importDefault(require("react"));
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
const MUIMenu_1 = require("../../../web/js/mui/menu/MUIMenu");
const MUIMenuItem_1 = require("../../../web/js/mui/menu/MUIMenuItem");
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
const LinkLoaderHook_1 = require("../../../web/js/ui/util/LinkLoaderHook");
const Clipboards_1 = require("../../../web/js/util/system/clipboard/Clipboards");
exports.DocViewerToolbarOverflowButton = ReactUtils_1.deepMemo((props) => {
    var _a, _b;
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    return (react_1.default.createElement(MUIMenu_1.MUIMenu, { caret: true, placement: "bottom-end", button: {
            icon: react_1.default.createElement(MoreVert_1.default, null),
            size: 'small'
        } },
        react_1.default.createElement("div", null,
            react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Open original URL in browser", disabled: !((_a = props.docInfo) === null || _a === void 0 ? void 0 : _a.url), onClick: () => { var _a; return linkLoader((_a = props.docInfo) === null || _a === void 0 ? void 0 : _a.url, { focus: true, newWindow: true }); } }),
            react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Copy original URL to clipboard", disabled: !((_b = props.docInfo) === null || _b === void 0 ? void 0 : _b.url), onClick: () => { var _a; return Clipboards_1.Clipboards.getInstance().writeText((_a = props.docInfo) === null || _a === void 0 ? void 0 : _a.url); } }))));
});
//# sourceMappingURL=DocViewerToolbarOverflowButton.js.map