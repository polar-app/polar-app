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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocImporter = void 0;
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const DocMetas_1 = require("../../../metadata/DocMetas");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const DatastoreFiles_1 = require("../../../datastore/DatastoreFiles");
const Hashcode_1 = require("polar-shared/src/metadata/Hashcode");
const URLs_1 = require("polar-shared/src/util/URLs");
const InputSources_1 = require("polar-shared/src/util/input/InputSources");
const BackendFileRefs_1 = require("../../../datastore/BackendFileRefs");
const DocMetadata_1 = require("./DocMetadata");
const log = Logger_1.Logger.create();
var DocImporter;
(function (DocImporter) {
    function importFile(persistenceLayerProvider, docPathOrURL, basename, opts = {}) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Importing doc docPathOrURL: ${docPathOrURL}, basename: ${basename}, opts: `, opts);
            const toDocType = () => {
                if (basename.toLowerCase().endsWith(".epub")) {
                    return 'epub';
                }
                if (basename.toLowerCase().endsWith(".pdf")) {
                    return 'pdf';
                }
                throw new Error("Unable to determine type from basename: " + basename);
            };
            const docType = toDocType();
            const isPath = !URLs_1.URLs.isURL(docPathOrURL);
            log.info(`Working with document: ${docPathOrURL}: isPath: ${isPath}`);
            const docMetadata = opts.docImport || (yield DocMetadata_1.DocMetadata.getMetadata(docPathOrURL, docType));
            const fileHashMeta = yield computeHashPrefix(docPathOrURL);
            const persistenceLayer = persistenceLayerProvider();
            const docID = fileHashMeta.hashcode;
            if (yield persistenceLayer.contains(docID)) {
                log.warn(`File already present in datastore: docID=${docID}: ${docPathOrURL}`);
                const docMeta = yield persistenceLayer.getDocMeta(docID);
                if (docMeta) {
                    if (docMeta.docInfo.filename) {
                        const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(docMeta);
                        const basename = FilePaths_1.FilePaths.basename(docMeta.docInfo.filename);
                        return {
                            action: 'skipped',
                            basename,
                            docInfo: docMeta.docInfo,
                            backendFileRef: backendFileRef
                        };
                    }
                }
            }
            if (!basename && !docPathOrURL.startsWith("blob:")) {
                basename = FilePaths_1.FilePaths.basename(docPathOrURL);
            }
            const defaultTitle = ((_a = opts === null || opts === void 0 ? void 0 : opts.docInfo) === null || _a === void 0 ? void 0 : _a.title) || basename || "";
            const sanitizedFilename = DatastoreFiles_1.DatastoreFiles.sanitizeFileName(basename);
            const filename = `${fileHashMeta.hashPrefix}-${sanitizedFilename}`;
            const toBinaryFileData = () => __awaiter(this, void 0, void 0, function* () {
                if (URLs_1.URLs.isURL(docPathOrURL)) {
                    log.info("Reading data from URL: ", docPathOrURL);
                    const response = yield fetch(docPathOrURL);
                    return yield response.blob();
                }
                return { path: docPathOrURL };
            });
            const binaryFileData = yield toBinaryFileData();
            const docMeta = DocMetas_1.DocMetas.create(docID, docMetadata.nrPages, filename);
            const docInfo = Object.assign(Object.assign(Object.assign({}, docMeta.docInfo), { title: Optional_1.Optional.of(docMetadata.title).getOrElse(defaultTitle), description: docMetadata.description, doi: docMetadata.doi, hashcode: {
                    enc: Hashcode_1.HashEncoding.BASE58CHECK,
                    alg: Hashcode_1.HashAlgorithm.KECCAK256,
                    data: fileHashMeta.hashcode
                } }), (opts.docInfo || {}));
            docMeta.docInfo = docInfo;
            const fileRef = {
                name: filename,
                hashcode: docMeta.docInfo.hashcode
            };
            const writeFile = Object.assign({ backend: Backend_1.Backend.STASH, data: binaryFileData }, fileRef);
            const writeFileOpts = {
                consistency: opts.consistency,
                writeFile,
                progressListener: opts.progressListener,
                onController: opts.onController
            };
            yield persistenceLayer.write(docID, docMeta, writeFileOpts);
            const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(docMeta);
            return {
                action: 'imported',
                basename,
                docInfo: docMeta.docInfo,
                backendFileRef: backendFileRef
            };
        });
    }
    DocImporter.importFile = importFile;
    function computeHashcode(docPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileHashMeta = yield computeHashPrefix(docPath);
            const hashcode = {
                enc: Hashcode_1.HashEncoding.BASE58CHECK,
                alg: Hashcode_1.HashAlgorithm.KECCAK256,
                data: fileHashMeta.hashcode
            };
            return hashcode;
        });
    }
    DocImporter.computeHashcode = computeHashcode;
    function computeHashPrefix(docPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputSource = yield InputSources_1.InputSources.ofValue(docPath);
            const hashcode = yield Hashcodes_1.Hashcodes.createFromInputSource(inputSource);
            const hashPrefix = hashcode.substring(0, 10);
            return { hashcode, hashPrefix };
        });
    }
})(DocImporter = exports.DocImporter || (exports.DocImporter = {}));
//# sourceMappingURL=DocImporter.js.map