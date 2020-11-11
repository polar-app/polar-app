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
exports.DiskDatastoreMigrations = exports.useDiskDatastoreMigration = void 0;
const react_1 = __importDefault(require("react"));
const PersistenceLayerApp_1 = require("../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp");
const MUILogger_1 = require("../../../mui/MUILogger");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const Paths_1 = require("polar-shared/src/util/Paths");
const Blobs_1 = require("polar-shared/src/util/Blobs");
const DocMetas_1 = require("../../../metadata/DocMetas");
const MUIDialogControllers_1 = require("../../../mui/dialogs/MUIDialogControllers");
const AsyncArrayStreams_1 = require("polar-shared/src/util/AsyncArrayStreams");
const UploadHandlers_1 = require("./UploadHandlers");
function useDiskDatastoreMigrationExecutor() {
    const log = MUILogger_1.useLogger();
    const { persistenceLayerProvider } = PersistenceLayerApp_1.usePersistenceLayerContext();
    const batchUploader = UploadHandlers_1.useBatchUploader();
    return react_1.default.useCallback((opts) => {
        const persistenceLayer = persistenceLayerProvider();
        function createDocMetaUploadHandler(docMetaProvider) {
            return __awaiter(this, void 0, void 0, function* () {
                return () => __awaiter(this, void 0, void 0, function* () {
                    const docMeta = yield docMetaProvider();
                    yield persistenceLayer.writeDocMeta(docMeta);
                });
            });
        }
        function createStashFileRefUploadHandler(stashFileRef) {
            return __awaiter(this, void 0, void 0, function* () {
                return (uploadProgress, onController) => __awaiter(this, void 0, void 0, function* () {
                    const blob = yield stashFileRef.data();
                    yield persistenceLayer.writeFile(Backend_1.Backend.STASH, stashFileRef.ref, blob, { progressListener: uploadProgress, onController });
                });
            });
        }
        function createImageFileRefUploadHandler(imageFileRef) {
            return __awaiter(this, void 0, void 0, function* () {
                return (uploadProgress, onController) => __awaiter(this, void 0, void 0, function* () {
                    const blob = yield imageFileRef.data();
                    yield persistenceLayer.writeFile(Backend_1.Backend.IMAGE, imageFileRef.ref, blob, { progressListener: uploadProgress, onController });
                });
            });
        }
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                const docMetaUploadHandlers = yield AsyncArrayStreams_1.asyncStream(opts.docMetaProviders).map(createDocMetaUploadHandler).collect();
                const stashFileRefUploadHandlers = yield AsyncArrayStreams_1.asyncStream(opts.stashFileRefs).map(createStashFileRefUploadHandler).collect();
                const imageFileRefUploadHandlers = yield AsyncArrayStreams_1.asyncStream(opts.imageFileRefs).map(createImageFileRefUploadHandler).collect();
                const uploadHandlers = [...docMetaUploadHandlers, ...stashFileRefUploadHandlers, ...imageFileRefUploadHandlers];
                return yield batchUploader(uploadHandlers);
            });
        }
        doAsync()
            .catch(err => log.error(err));
    }, [persistenceLayerProvider, log, batchUploader]);
}
function useDiskDatastoreMigration() {
    const diskDatastoreMigrationExecutor = useDiskDatastoreMigrationExecutor();
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    return react_1.default.useCallback((opts) => {
        dialogManager.confirm({
            title: "Migrate Polar 1.0 Data?",
            type: 'info',
            subtitle: (react_1.default.createElement("div", null,
                react_1.default.createElement("p", null, "Looks like you're migrating data from Polar 1.0."),
                react_1.default.createElement("p", null, "This migration tool will migrate all of your data including documents and annotations from Polar 1.0."))),
            onAccept: () => diskDatastoreMigrationExecutor(opts)
        });
    }, [diskDatastoreMigrationExecutor, dialogManager]);
}
exports.useDiskDatastoreMigration = useDiskDatastoreMigration;
var DiskDatastoreMigrations;
(function (DiskDatastoreMigrations) {
    function prepare(uploads) {
        function toBaseFileRef(upload) {
            const name = Paths_1.Paths.basename(upload.path);
            return {
                ref: {
                    name
                },
                data: upload.blob
            };
        }
        function computeImageFileRefs() {
            function filter(upload) {
                return upload.path !== undefined &&
                    upload.path.match(/^\/?\.polar\/files\/image\//) &&
                    upload.path.endsWith(".png");
            }
            return uploads.filter(filter)
                .map(toBaseFileRef);
        }
        function computeStashFileRefs() {
            function filter(upload) {
                return upload.path !== undefined &&
                    upload.path.match(/^\/?\.polar\/stash\//) &&
                    upload.path.toLowerCase().endsWith(".pdf");
            }
            return uploads.filter(filter)
                .map(toBaseFileRef);
        }
        function computeDocMetaProviders() {
            function filter(upload) {
                return upload.path !== undefined &&
                    upload.path.match(/^\/?\.polar\//) &&
                    upload.path.toLowerCase().endsWith("/state.json");
            }
            function toDocMetaProvider(upload) {
                return () => __awaiter(this, void 0, void 0, function* () {
                    function computeFingerprint() {
                        const parts = upload.path.split('/');
                        return parts[parts.length - 1];
                    }
                    const fingerprint = computeFingerprint();
                    const blob = yield upload.blob();
                    const json = yield Blobs_1.Blobs.toText(blob);
                    return DocMetas_1.DocMetas.deserialize(json, fingerprint);
                });
            }
            return uploads.filter(filter)
                .map(toDocMetaProvider);
        }
        const imageFileRefs = computeImageFileRefs();
        const stashFileRefs = computeStashFileRefs();
        const docMetaProviders = computeDocMetaProviders();
        console.log(`Found ${imageFileRefs.length} image files, ${stashFileRefs.length} stash files, and ${docMetaProviders.length} docMeta files.`);
        const required = docMetaProviders.length > 0;
        return { imageFileRefs, stashFileRefs, docMetaProviders, required };
    }
    DiskDatastoreMigrations.prepare = prepare;
})(DiskDatastoreMigrations = exports.DiskDatastoreMigrations || (exports.DiskDatastoreMigrations = {}));
//# sourceMappingURL=DiskDatastoreMigrations.js.map