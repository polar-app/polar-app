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
exports.PDFViewerContainer = void 0;
const React = __importStar(require("react"));
const MUIContextMenu_1 = require("../../../../repository/js/doc_repo/MUIContextMenu");
const Elements_1 = require("../../../../../web/js/util/Elements");
const GlobalPDFCss_1 = require("./GlobalPDFCss");
let iter = 0;
exports.PDFViewerContainer = () => {
    ++iter;
    const contextMenu = MUIContextMenu_1.useContextMenu();
    const onContextMenu = React.useCallback((event) => {
        const pageElement = Elements_1.Elements.untilRoot(event.target, ".page");
        if (!pageElement) {
            console.warn("Not found within .page element");
            return;
        }
        contextMenu.onContextMenu(event);
    }, [contextMenu]);
    return (React.createElement(React.Fragment, null,
        React.createElement(GlobalPDFCss_1.GlobalPDFCss, null),
        React.createElement("main", { onContextMenu: onContextMenu, id: "viewerContainer", style: {
                position: 'absolute',
                overflow: 'auto',
                top: '0',
                width: '100%',
                height: '100%'
            }, itemProp: "mainContentOfPage", "data-iter": iter },
            React.createElement("div", null,
                React.createElement("div", { id: "viewer", className: "pdfViewer" },
                    React.createElement("div", null))))));
};
//# sourceMappingURL=PDFViewerContainer.js.map