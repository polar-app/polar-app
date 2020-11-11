"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameContextMenuPortalContent = void 0;
const ReactUtils_1 = require("../../../../../../web/js/react/ReactUtils");
const EPUBIFrameWindowEventListener_1 = require("./EPUBIFrameWindowEventListener");
const react_1 = __importDefault(require("react"));
const DocViewerMenu_1 = require("../../../DocViewerMenu");
const MUIContextMenu_1 = require("../../../../../repository/js/doc_repo/MUIContextMenu");
const DocViewerContextMenu = MUIContextMenu_1.createContextMenu(DocViewerMenu_1.DocViewerMenu, { computeOrigin: DocViewerMenu_1.computeDocViewerContextMenuOrigin });
exports.EPUBIFrameContextMenuPortalContent = ReactUtils_1.deepMemo(() => {
    return (react_1.default.createElement(DocViewerContextMenu, null,
        react_1.default.createElement(EPUBIFrameWindowEventListener_1.EPUBIFrameWindowEventListener, null)));
});
//# sourceMappingURL=EPUBIFrameContextMenuPortalContent.js.map