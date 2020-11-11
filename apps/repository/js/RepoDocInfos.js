"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoDocInfos = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const DocInfos_1 = require("../../../web/js/metadata/DocInfos");
const SortFunctions_1 = require("./doc_repo/util/SortFunctions");
const Objects_1 = require("polar-shared/src/util/Objects");
class RepoDocInfos {
    static isValid(repoDocInfo) {
        return Preconditions_1.isPresent(repoDocInfo.filename);
    }
    static convert(docMeta) {
        Preconditions_1.Preconditions.assertPresent(docMeta, "docMeta");
        const docInfo = docMeta.docInfo;
        return {
            id: docInfo.fingerprint,
            fingerprint: docInfo.fingerprint,
            title: DocInfos_1.DocInfos.bestTitle(docInfo),
            progress: Optional_1.Optional.of(docInfo.progress)
                .validateNumber()
                .getOrElse(0),
            filename: Optional_1.Optional.of(docInfo.filename)
                .validateString()
                .getOrUndefined(),
            added: Optional_1.Optional.of(docInfo.added)
                .map(current => this.toISODateTimeString(current))
                .validateString()
                .getOrUndefined(),
            lastUpdated: Optional_1.Optional.of(docInfo.lastUpdated)
                .map(current => this.toISODateTimeString(current))
                .validateString()
                .getOrUndefined(),
            flagged: Optional_1.Optional.of(docInfo.flagged)
                .validateBoolean()
                .getOrElse(false),
            archived: Optional_1.Optional.of(docInfo.archived)
                .validateBoolean()
                .getOrElse(false),
            tags: docInfo.tags || {},
            site: Optional_1.Optional.of(docInfo.url)
                .map(url => new URL(url).hostname)
                .getOrUndefined(),
            url: docInfo.url,
            nrAnnotations: Optional_1.Optional.of(docInfo.nrAnnotations)
                .getOrElse(0),
            hashcode: docInfo.hashcode,
            docInfo,
            docMeta
        };
    }
    static toISODateTimeString(current) {
        if (typeof current === 'object') {
            const obj = current;
            if (Preconditions_1.isPresent(obj.value) && typeof obj.value === 'string') {
                return obj.value;
            }
        }
        return current;
    }
    static toTags(repoDocInfo) {
        if (repoDocInfo) {
            return Object.values(repoDocInfo.tags || {});
        }
        return [];
    }
    static sort(a, b, formatRecord) {
        const cmp = SortFunctions_1.SortFunctions.compareWithEmptyStringsLast(a, b, formatRecord);
        if (cmp !== 0) {
            return cmp;
        }
        return Objects_1.Objects.toObjectSTR(a.added).localeCompare(Objects_1.Objects.toObjectSTR(b.added));
    }
}
exports.RepoDocInfos = RepoDocInfos;
//# sourceMappingURL=RepoDocInfos.js.map