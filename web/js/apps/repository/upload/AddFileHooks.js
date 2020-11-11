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
exports.AddFileHooks = void 0;
const react_1 = __importDefault(require("react"));
const DocImporter_1 = require("../importers/DocImporter");
const MUILogger_1 = require("../../../mui/MUILogger");
const PersistenceLayerApp_1 = require("../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const MUIDialogControllers_1 = require("../../../mui/dialogs/MUIDialogControllers");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const DocLoaderHooks_1 = require("../../main/DocLoaderHooks");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const BackendFileRefs_1 = require("../../../datastore/BackendFileRefs");
const Either_1 = require("../../../util/Either");
const Launch_1 = __importDefault(require("@material-ui/icons/Launch"));
const Strings_1 = require("polar-shared/src/util/Strings");
const AddContentButtons_1 = require("../../../../../apps/repository/js/ui/AddContentButtons");
const Tags_1 = require("polar-shared/src/tags/Tags");
const DiskDatastoreMigrations_1 = require("./DiskDatastoreMigrations");
const UploadFilters_1 = require("./UploadFilters");
const UploadHandlers_1 = require("./UploadHandlers");
var AddFileHooks;
(function (AddFileHooks) {
    var useAccountVerifiedAction = AddContentButtons_1.AddContentButtons.useAccountVerifiedAction;
    function useAddFileImporter() {
        const log = MUILogger_1.useLogger();
        const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
        const dialogManager = MUIDialogControllers_1.useDialogManager();
        const docLoader = DocLoaderHooks_1.useDocLoader();
        const accountVerifiedAction = useAccountVerifiedAction();
        const diskDatastoreMigration = DiskDatastoreMigrations_1.useDiskDatastoreMigration();
        const batchUploader = UploadHandlers_1.useBatchUploader();
        const handleUploads = react_1.default.useCallback((uploads) => __awaiter(this, void 0, void 0, function* () {
            function toUploadHandler(upload) {
                return (uploadProgress, onController) => __awaiter(this, void 0, void 0, function* () {
                    console.log("uploading file: ", upload.name);
                    const blob = yield upload.blob();
                    const docInfo = {
                        tags: upload.tags ? Tags_1.Tags.toMap(upload.tags) : undefined,
                        bytes: blob.size
                    };
                    const importedFile = yield DocImporter_1.DocImporter.importFile(persistenceLayerProvider, URL.createObjectURL(blob), FilePaths_1.FilePaths.basename(upload.name), { progressListener: uploadProgress, docInfo, onController });
                    console.log("Imported file: ", importedFile);
                    return importedFile;
                });
            }
            const uploadHandlers = uploads.map(toUploadHandler);
            return yield batchUploader(uploadHandlers);
        }), [batchUploader, persistenceLayerProvider]);
        const promptToOpenFiles = react_1.default.useCallback((importedFiles) => {
            function createSnackbar(importedFile) {
                const title = Strings_1.Strings.truncate(importedFile.docInfo.title || 'Untitled', 20);
                const { docInfo } = importedFile;
                function doOpenDoc() {
                    const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(Either_1.Either.ofRight(docInfo));
                    const docLoadRequest = {
                        fingerprint: docInfo.fingerprint,
                        title,
                        url: docInfo.url,
                        backendFileRef,
                        newWindow: true
                    };
                    docLoader(docLoadRequest);
                }
                const Action = () => (react_1.default.createElement(IconButton_1.default, { size: "small", color: "secondary", onClick: doOpenDoc },
                    react_1.default.createElement(Launch_1.default, null)));
                dialogManager.snackbar({
                    message: `Would you like to open '${title}' now?`,
                    type: 'success',
                    action: react_1.default.createElement(Action, null)
                });
            }
            if (importedFiles.length === 1) {
                const importedFile = importedFiles[0];
                createSnackbar(importedFile);
            }
        }, [dialogManager, docLoader]);
        const doDirectUpload = react_1.default.useCallback((uploads) => __awaiter(this, void 0, void 0, function* () {
            if (uploads.length > 0) {
                function doAsync() {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const importedFiles = yield handleUploads(uploads);
                            promptToOpenFiles(importedFiles);
                        }
                        catch (e) {
                            log.error("Unable to upload files: ", uploads, e);
                        }
                    });
                }
                accountVerifiedAction(() => doAsync().catch(err => log.error(err)));
            }
            else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }
        }), [accountVerifiedAction, handleUploads, log, promptToOpenFiles]);
        return react_1.default.useCallback((uploads) => {
            if (!uploads || uploads.length === 0) {
                log.warn("No dataTransfer files");
                return;
            }
            const migration = DiskDatastoreMigrations_1.DiskDatastoreMigrations.prepare(uploads);
            if (migration.required) {
                diskDatastoreMigration(migration);
            }
            else {
                doDirectUpload(uploads.filter(UploadFilters_1.UploadFilters.filterByDocumentName))
                    .catch(err => log.error("Unable to handle upload: ", err));
            }
        }, [log, diskDatastoreMigration, doDirectUpload]);
    }
    AddFileHooks.useAddFileImporter = useAddFileImporter;
})(AddFileHooks = exports.AddFileHooks || (exports.AddFileHooks = {}));
//# sourceMappingURL=AddFileHooks.js.map