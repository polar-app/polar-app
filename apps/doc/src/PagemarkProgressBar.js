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
exports.PagemarkProgressBar = exports.ProgressBar = void 0;
const DocMetas_1 = require("../../../web/js/metadata/DocMetas");
const React = __importStar(require("react"));
const MUIPaperToolbar_1 = require("../../../web/js/mui/MUIPaperToolbar");
const DocViewerStore_1 = require("./DocViewerStore");
const ReadingProgressResume_1 = require("../../../web/js/view/ReadingProgressResume");
const MUIContextMenu_1 = require("../../repository/js/doc_repo/MUIContextMenu");
const PagemarkProgressBarMenu_1 = require("./PagemarkProgressBarMenu");
var useReadingProgressResume = ReadingProgressResume_1.ReadingProgressResume.useReadingProgressResume;
const ReactUtils_1 = require("../../../web/js/react/ReactUtils");
exports.ProgressBar = ReactUtils_1.deepMemo(() => {
    const { docMeta } = DocViewerStore_1.useDocViewerStore(['docMeta']);
    const [, resumeProgressHandler] = useReadingProgressResume();
    const contextMenuHandlers = MUIContextMenu_1.useContextMenu();
    if (!docMeta) {
        return null;
    }
    const perc = DocMetas_1.DocMetas.computeProgress(docMeta);
    const handleDoubleClick = () => {
        resumeProgressHandler();
    };
    return (React.createElement("progress", Object.assign({}, contextMenuHandlers, { value: perc, onDoubleClick: handleDoubleClick, className: "mt-auto mb-auto", style: { flexGrow: 1 } })));
});
exports.PagemarkProgressBar = React.memo(() => {
    const ContextMenu = React.useMemo(() => MUIContextMenu_1.createContextMenu(PagemarkProgressBarMenu_1.PagemarkProgressBarMenu), []);
    return (React.createElement(ContextMenu, null,
        React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true },
            React.createElement("div", { style: {
                    display: 'flex',
                    alignItems: "center"
                }, className: "p-1" },
                React.createElement(exports.ProgressBar, null)))));
});
//# sourceMappingURL=PagemarkProgressBar.js.map