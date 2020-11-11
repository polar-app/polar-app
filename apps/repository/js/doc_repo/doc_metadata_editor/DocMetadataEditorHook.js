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
exports.useDocMetadataEditorForSelected = exports.useDocMetadataEditor = void 0;
const React = __importStar(require("react"));
const MUIDialogControllers_1 = require("../../../../../web/js/mui/dialogs/MUIDialogControllers");
const DocMetadataEditor_1 = require("./DocMetadataEditor");
const DocRepoStore2_1 = require("../DocRepoStore2");
function useDocMetadataEditor() {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const docInfoRef = React.useRef();
    const handleUpdate = React.useCallback((docInfo) => {
        docInfoRef.current = docInfo;
    }, []);
    return React.useCallback((docInfo, onUpdate) => {
        docInfoRef.current = docInfo;
        dialogs.dialog({
            title: "Update Document Metadata",
            body: (React.createElement(React.Fragment, null, docInfo && (React.createElement(DocMetadataEditor_1.DocMetadataEditor, { docInfo: docInfo, onUpdate: handleUpdate })))),
            type: 'none',
            onAccept: () => onUpdate(docInfoRef.current),
            acceptText: "Update",
            maxWidth: "lg",
            inputCompletionType: 'meta+enter'
        });
    }, [dialogs, handleUpdate]);
}
exports.useDocMetadataEditor = useDocMetadataEditor;
function useDocMetadataEditorForSelected() {
    const { selectedProvider, onUpdated } = DocRepoStore2_1.useDocRepoCallbacks();
    const docMetadataEditor = useDocMetadataEditor();
    const handleUpdated = React.useCallback((repoDocInfo, docInfo) => {
        onUpdated(repoDocInfo, docInfo);
    }, [onUpdated]);
    return React.useCallback(() => {
        const selected = selectedProvider();
        if (selected.length === 0) {
            return;
        }
        const repoDocInfo = selected[0];
        docMetadataEditor(repoDocInfo.docInfo, (docInfo) => handleUpdated(repoDocInfo, docInfo));
    }, [docMetadataEditor, handleUpdated, selectedProvider]);
}
exports.useDocMetadataEditorForSelected = useDocMetadataEditorForSelected;
//# sourceMappingURL=DocMetadataEditorHook.js.map