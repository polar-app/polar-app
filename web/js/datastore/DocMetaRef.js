"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaFileRefs = void 0;
class DocMetaFileRefs {
    static createFromDocMeta(docMeta) {
        const docInfo = docMeta.docInfo;
        return {
            fingerprint: docInfo.fingerprint,
            docFile: {
                name: docInfo.filename,
                hashcode: docInfo.hashcode
            },
            docInfo,
            docMetaProvider: () => Promise.resolve(docMeta)
        };
    }
    static createFromDocInfo(docInfo) {
        return {
            fingerprint: docInfo.fingerprint,
            docFile: {
                name: docInfo.filename,
                hashcode: docInfo.hashcode
            },
            docInfo
        };
    }
}
exports.DocMetaFileRefs = DocMetaFileRefs;
//# sourceMappingURL=DocMetaRef.js.map