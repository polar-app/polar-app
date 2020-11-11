"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocDropdownMenuItems = exports.useJSONDownloadHandler = exports.useDocumentDownloadHandler = void 0;
const react_1 = __importDefault(require("react"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ListItemIcon_1 = __importDefault(require("@material-ui/core/ListItemIcon"));
const ListItemText_1 = __importDefault(require("@material-ui/core/ListItemText"));
const Send_1 = __importDefault(require("@material-ui/icons/Send"));
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const Title_1 = __importDefault(require("@material-ui/icons/Title"));
const FileCopy_1 = __importDefault(require("@material-ui/icons/FileCopy"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const Flag_1 = __importDefault(require("@material-ui/icons/Flag"));
const Archive_1 = __importDefault(require("@material-ui/icons/Archive"));
const FeatureToggles_1 = require("polar-shared/src/util/FeatureToggles");
const DocRepoStore2_1 = require("./DocRepoStore2");
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const Arrays_1 = require("polar-shared/src/util/Arrays");
const PersistenceLayerApp_1 = require("../persistence_layer/PersistenceLayerApp");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const BackendFileRefs_1 = require("../../../../web/js/datastore/BackendFileRefs");
const Either_1 = require("../../../../web/js/util/Either");
const FileSavers_1 = require("polar-file-saver/src/FileSavers");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const SaveAlt_1 = __importDefault(require("@material-ui/icons/SaveAlt"));
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const Ballot_1 = __importDefault(require("@material-ui/icons/Ballot"));
const DocMetadataEditorHook_1 = require("./doc_metadata_editor/DocMetadataEditorHook");
function useErrorDialog() {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    return react_1.default.useCallback((opts) => {
        dialogs.confirm(Object.assign(Object.assign({}, opts), { noCancel: true, type: 'error', onAccept: Functions_1.NULL_FUNCTION }));
    }, [dialogs]);
}
function useDocumentDownloadHandler() {
    const { selectedProvider } = DocRepoStore2_1.useDocRepoCallbacks();
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceContext();
    const errorDialog = useErrorDialog();
    return react_1.default.useCallback(() => {
        const selected = selectedProvider();
        const repoDocInfo = Arrays_1.Arrays.first(selected);
        if (!repoDocInfo) {
            errorDialog({
                title: "No document selected",
                subtitle: "There is no document selected to download.",
            });
            return;
        }
        const persistenceLayer = persistenceLayerProvider();
        const fileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofRight(repoDocInfo.docInfo));
        if (!fileRef) {
            errorDialog({
                title: "No document attached to file.",
                subtitle: "The document you're trying to save doesn't have an attachment (EPUB or PDF).",
            });
            return;
        }
        const { url } = persistenceLayer.getFile(Backend_1.Backend.STASH, fileRef);
        FileSavers_1.FileSavers.saveAs(url, fileRef.name);
    }, [selectedProvider, errorDialog, persistenceLayerProvider]);
}
exports.useDocumentDownloadHandler = useDocumentDownloadHandler;
function useJSONDownloadHandler() {
    const { selectedProvider } = DocRepoStore2_1.useDocRepoCallbacks();
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceContext();
    const errorDialog = useErrorDialog();
    const log = MUILogger_1.useLogger();
    return react_1.default.useCallback(() => {
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const selected = selectedProvider();
                const repoDocInfo = Arrays_1.Arrays.first(selected);
                if (repoDocInfo) {
                    const persistenceLayer = persistenceLayerProvider();
                    const docMeta = yield persistenceLayer.getDocMeta(repoDocInfo.docInfo.fingerprint);
                    if (!docMeta) {
                        errorDialog({
                            title: "No document metadata for document",
                            subtitle: "Could not find any document metadata for document."
                        });
                        return;
                    }
                    const json = JSON.stringify(docMeta, null, "  ");
                    const blob = new Blob([json], { type: "text/json" });
                    FileSavers_1.FileSavers.saveAs(blob, repoDocInfo.docInfo.fingerprint + ".json");
                }
            });
        }
        doAsync().catch(err => log.error(err));
    }, [selectedProvider, errorDialog, persistenceLayerProvider, log]);
}
exports.useJSONDownloadHandler = useJSONDownloadHandler;
const UpdateDocMetadataMenuItem = ReactUtils_1.deepMemo(() => {
    const docMetadataEditorForSelected = DocMetadataEditorHook_1.useDocMetadataEditorForSelected();
    return (react_1.default.createElement(MenuItem_1.default, { onClick: docMetadataEditorForSelected },
        react_1.default.createElement(ListItemIcon_1.default, null,
            react_1.default.createElement(Ballot_1.default, { fontSize: "small" })),
        react_1.default.createElement(ListItemText_1.default, { primary: "Update Metadata" })));
});
exports.MUIDocDropdownMenuItems = react_1.default.memo(() => {
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const selected = callbacks.selectedProvider();
    const documentDownloadHandler = useDocumentDownloadHandler();
    const jsonDownloadHandler = useJSONDownloadHandler();
    const isSingle = selected.length === 1;
    const single = selected.length === 1 ? selected[0] : undefined;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        isSingle &&
            react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onOpen },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Send_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Open Document" })),
        react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onTagged },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(LocalOffer_1.default, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Tag" })),
        isSingle &&
            react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onRename },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(Title_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Rename" })),
        react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onFlagged },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(Flag_1.default, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Flag" })),
        react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onArchived },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(Archive_1.default, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Archive" })),
        isSingle &&
            react_1.default.createElement(UpdateDocMetadataMenuItem, null),
        single && single.url &&
            react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onCopyOriginalURL },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(FileCopy_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Copy Original URL" })),
        isSingle && FeatureToggles_1.FeatureToggles.get('dev') &&
            react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onCopyDocumentID },
                react_1.default.createElement(ListItemIcon_1.default, null,
                    react_1.default.createElement(FileCopy_1.default, { fontSize: "small" })),
                react_1.default.createElement(ListItemText_1.default, { primary: "Copy Document ID" })),
        react_1.default.createElement(Divider_1.default, null),
        react_1.default.createElement(MenuItem_1.default, { onClick: documentDownloadHandler },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(SaveAlt_1.default, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Download Document" })),
        react_1.default.createElement(MenuItem_1.default, { onClick: jsonDownloadHandler },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(MUIFontAwesome_1.FADatabaseIcon, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Download Document Metadata" })),
        react_1.default.createElement(Divider_1.default, null),
        react_1.default.createElement(MenuItem_1.default, { onClick: callbacks.onDeleted },
            react_1.default.createElement(ListItemIcon_1.default, null,
                react_1.default.createElement(Delete_1.default, { fontSize: "small" })),
            react_1.default.createElement(ListItemText_1.default, { primary: "Delete" }))));
});
//# sourceMappingURL=MUIDocDropdownMenuItems.js.map