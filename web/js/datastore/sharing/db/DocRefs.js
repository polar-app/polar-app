"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRefs = void 0;
class DocRefs {
    static fromDocMeta(docID, docMeta) {
        return {
            docID,
            fingerprint: docMeta.docInfo.fingerprint,
            title: docMeta.docInfo.title || "",
            subtitle: docMeta.docInfo.subtitle,
            nrPages: docMeta.docInfo.nrPages,
            description: docMeta.docInfo.description,
            url: docMeta.docInfo.url,
            tags: docMeta.docInfo.tags,
            published: docMeta.docInfo.published,
            doi: docMeta.docInfo.doi
        };
    }
    static copyToDocInfo(docRef, docInfo) {
        docInfo.fingerprint = docRef.fingerprint;
        docInfo.title = docRef.title;
        docInfo.subtitle = docRef.subtitle;
        docInfo.nrPages = docRef.nrPages;
        docInfo.description = docRef.description;
        docInfo.url = docRef.url;
        docInfo.tags = docRef.tags;
        docInfo.published = docRef.published;
        docInfo.doi = docRef.doi;
        return docInfo;
    }
}
exports.DocRefs = DocRefs;
//# sourceMappingURL=DocRefs.js.map