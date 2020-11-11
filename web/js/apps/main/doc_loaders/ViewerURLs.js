"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewerURLs = void 0;
const PDFLoader_1 = require("../file_loaders/PDFLoader");
const EPUBLoader_1 = require("../file_loaders/EPUBLoader");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
var ViewerURLs;
(function (ViewerURLs) {
    function create(persistenceLayerProvider, loadDocRequest) {
        const { backendFileRef, fingerprint } = loadDocRequest;
        const fileName = backendFileRef.name;
        const persistenceLayer = persistenceLayerProvider();
        const datastoreFile = persistenceLayer.getFile(backendFileRef.backend, backendFileRef);
        if (FilePaths_1.FilePaths.hasExtension(fileName, "pdf")) {
            return PDFLoader_1.PDFLoader.createViewerURL(fingerprint, datastoreFile.url, backendFileRef.name);
        }
        else if (FilePaths_1.FilePaths.hasExtension(fileName, "epub")) {
            return EPUBLoader_1.EPUBLoader.createViewerURL(fingerprint);
        }
        else {
            throw new Error("Unable to handle file: " + fileName);
        }
    }
    ViewerURLs.create = create;
})(ViewerURLs = exports.ViewerURLs || (exports.ViewerURLs = {}));
//# sourceMappingURL=ViewerURLs.js.map