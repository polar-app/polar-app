"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoDocMetas = void 0;
const RepoDocInfos_1 = require("./RepoDocInfos");
const RepoDocAnnotations_1 = require("./RepoDocAnnotations");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class RepoDocMetas {
    static isValid(repoDocMeta) {
        if (!repoDocMeta) {
            return 'no-value';
        }
        if (!Preconditions_1.isPresent(repoDocMeta.repoDocInfo.filename)) {
            return 'no-filename';
        }
        return 'valid';
    }
    static convert(persistenceLayerProvider, fingerprint, docMeta) {
        if (!docMeta) {
            log.warn("No docMeta for file: ", fingerprint);
            return undefined;
        }
        if (!docMeta.docInfo) {
            log.warn("No docInfo for file: ", fingerprint);
            return undefined;
        }
        const repoDocInfo = RepoDocInfos_1.RepoDocInfos.convert(docMeta);
        const repoAnnotations = RepoDocAnnotations_1.RepoDocAnnotations.convert(persistenceLayerProvider, docMeta);
        return { repoDocInfo, repoDocAnnotations: repoAnnotations };
    }
}
exports.RepoDocMetas = RepoDocMetas;
//# sourceMappingURL=RepoDocMetas.js.map