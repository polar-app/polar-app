"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameMenuPortal = void 0;
const ReactUtils_1 = require("../../../../../../web/js/react/ReactUtils");
const EPUBIFrameContext_1 = require("./EPUBIFrameContext");
const react_dom_1 = __importDefault(require("react-dom"));
const EPUBIFrameContextMenuPortalContent_1 = require("./EPUBIFrameContextMenuPortalContent");
const react_1 = __importDefault(require("react"));
exports.EPUBIFrameMenuPortal = ReactUtils_1.deepMemo(() => {
    const iframe = EPUBIFrameContext_1.useEPUBIFrameContext();
    return react_dom_1.default.createPortal(react_1.default.createElement(EPUBIFrameContextMenuPortalContent_1.EPUBIFrameContextMenuPortalContent, null), iframe.contentDocument.body);
});
//# sourceMappingURL=EPUBIFrameMenuPortal.js.map