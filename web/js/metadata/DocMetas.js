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
exports.MockDocMetas = exports.DocMetas = void 0;
const PageMeta_1 = require("./PageMeta");
const DocMeta_1 = require("./DocMeta");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
const PageInfo_1 = require("./PageInfo");
const DocInfos_1 = require("./DocInfos");
const AnnotationInfos_1 = require("./AnnotationInfos");
const Pagemarks_1 = require("./Pagemarks");
const MetadataSerializer_1 = require("./MetadataSerializer");
const PageMetas_1 = require("./PageMetas");
const Functions_1 = require("polar-shared/src/util/Functions");
const TextHighlights_1 = require("./TextHighlights");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Errors_1 = require("../util/Errors");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const UUIDs_1 = require("./UUIDs");
class DocMetas {
    static annotations(docMeta, callback) {
        for (const pageMeta of Object.values(docMeta.pageMetas)) {
            for (const annotation of Object.values(pageMeta.textHighlights || {})) {
                callback(pageMeta, annotation, AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT);
            }
            for (const annotation of Object.values(pageMeta.areaHighlights || {})) {
                callback(pageMeta, annotation, AnnotationType_1.AnnotationType.AREA_HIGHLIGHT);
            }
            for (const annotation of Object.values(pageMeta.flashcards || {})) {
                callback(pageMeta, annotation, AnnotationType_1.AnnotationType.FLASHCARD);
            }
            for (const annotation of Object.values(pageMeta.comments || {})) {
                callback(pageMeta, annotation, AnnotationType_1.AnnotationType.COMMENT);
            }
        }
    }
    static create(fingerprint, nrPages, filename) {
        const docInfo = DocInfos_1.DocInfos.create(fingerprint, nrPages, filename);
        const pageMetas = {};
        for (let idx = 1; idx <= nrPages; ++idx) {
            const pageInfo = new PageInfo_1.PageInfo({ num: idx });
            const pageMeta = new PageMeta_1.PageMeta({ pageInfo });
            pageMetas[idx] = pageMeta;
        }
        return new DocMeta_1.DocMeta(docInfo, pageMetas);
    }
    static createWithinInitialPagemarks(fingerprint, nrPages) {
        return MockDocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
    }
    static createMockDocMeta() {
        return MockDocMetas.createMockDocMeta();
    }
    static getPageMeta(docMeta, num) {
        Preconditions_1.Preconditions.assertPresent(docMeta, "docMeta");
        Preconditions_1.Preconditions.assertPresent(num, "num");
        const pageMeta = docMeta.pageMetas[num];
        if (!pageMeta) {
            throw new Error("No pageMeta for page: " + num);
        }
        return pageMeta;
    }
    static addPagemarks(docMeta, options) {
        if (!options) {
            options = {};
        }
        if (!options.nrPages) {
            options.nrPages = 3;
        }
        if (!options.offsetPage) {
            options.offsetPage = 1;
        }
        if (!options.percentage) {
            options.percentage = 100;
        }
        const maxPageNum = Math.min(options.offsetPage + options.nrPages - 1, docMeta.docInfo.nrPages);
        for (let pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum) {
            const pagemark = Pagemarks_1.Pagemarks.create({
                type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });
            Pagemarks_1.Pagemarks.updatePagemark(docMeta, pageNum, pagemark);
        }
    }
    static serialize(docMeta, spacing = "  ") {
        return MetadataSerializer_1.MetadataSerializer.serialize(docMeta, spacing);
    }
    static deserialize(data, fingerprint) {
        Preconditions_1.Preconditions.assertPresent(data, 'data');
        if (!(typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }
        let docMeta = Object.create(DocMeta_1.DocMeta.prototype);
        try {
            docMeta = MetadataSerializer_1.MetadataSerializer.deserialize(docMeta, data);
            if (docMeta.docInfo && !docMeta.docInfo.filename) {
            }
            return DocMetas.upgrade(docMeta);
        }
        catch (e) {
            throw Errors_1.Errors.rethrow(e, "Unable to deserialize doc: " + fingerprint);
        }
    }
    static upgrade(docMeta) {
        docMeta.pageMetas = PageMetas_1.PageMetas.upgrade(docMeta.pageMetas);
        if (!docMeta.annotationInfo) {
            docMeta.annotationInfo = AnnotationInfos_1.AnnotationInfos.create();
        }
        if (!docMeta.attachments) {
            docMeta.attachments = {};
        }
        docMeta.docInfo = DocInfos_1.DocInfos.upgrade(docMeta.docInfo);
        return docMeta;
    }
    static computeProgress(docMeta) {
        let total = 0;
        Functions_1.forDict(docMeta.pageMetas, (key, pageMeta) => {
            Functions_1.forDict(pageMeta.pagemarks, (column, pagemark) => {
                total += pagemark.percentage;
            });
        });
        return total / (docMeta.docInfo.nrPages * 100);
    }
    static withBatchedMutations(docMeta, mutator) {
        return this.withMutating(docMeta, 'batch', mutator);
    }
    static withSkippedMutations(docMeta, mutator) {
        return this.withMutating(docMeta, 'skip', mutator);
    }
    static withMutating(docMeta, value, mutator) {
        if (docMeta.docInfo.mutating === value) {
            return mutator();
        }
        try {
            docMeta.docInfo.mutating = value;
            return mutator();
        }
        finally {
            docMeta.docInfo.mutating = undefined;
        }
    }
    static forceWrite(docMeta) {
        docMeta.docInfo.lastUpdated = ISODateTimeStrings_1.ISODateTimeStrings.create();
    }
    static updated(docMeta) {
        docMeta = Dictionaries_1.Dictionaries.copyOf(docMeta);
        docMeta.docInfo.lastUpdated = ISODateTimeStrings_1.ISODateTimeStrings.create();
        docMeta.docInfo.uuid = UUIDs_1.UUIDs.create();
        const docInfo = Dictionaries_1.Dictionaries.copyOf(docMeta.docInfo);
        return Object.assign(new DocMeta_1.DocMeta(docInfo, {}), docMeta);
    }
    static copyOf(docMeta) {
        docMeta = Dictionaries_1.Dictionaries.copyOf(docMeta);
        const docInfo = Dictionaries_1.Dictionaries.copyOf(docMeta.docInfo);
        return Object.assign(new DocMeta_1.DocMeta(docInfo, {}), docMeta);
    }
}
exports.DocMetas = DocMetas;
class MockDocMetas {
    static createWithinInitialPagemarks(fingerprint, nrPages) {
        const result = DocMetas.create(fingerprint, nrPages);
        const maxPages = 3;
        for (let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum) {
            const pagemark = Pagemarks_1.Pagemarks.create({
                type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });
            Pagemarks_1.Pagemarks.updatePagemark(result, pageNum, pagemark);
        }
        return result;
    }
    static createMockDocMeta(fingerprint = "0x001") {
        const nrPages = 4;
        const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
        const textHighlight = TextHighlights_1.TextHighlights.createMockTextHighlight();
        DocMetas.getPageMeta(docMeta, 1).textHighlights[textHighlight.id] = textHighlight;
        return docMeta;
    }
    static createMockDocMetaFromPDF(datastore) {
        return __awaiter(this, void 0, void 0, function* () {
            const docMeta = MockDocMetas.createMockDocMeta();
            const pdfPath = FilePaths_1.FilePaths.join(__dirname, "..", "..", "..", "docs", "examples", "pdf", "chubby.pdf");
            const fileRef = {
                name: "chubby.pdf"
            };
            docMeta.docInfo.filename = fileRef.name;
            docMeta.docInfo.backend = Backend_1.Backend.STASH;
            yield datastore.writeFile(Backend_1.Backend.STASH, fileRef, { path: pdfPath });
            yield datastore.writeDocMeta(docMeta);
            const result = {
                docMeta, fileRef
            };
            return result;
        });
    }
}
exports.MockDocMetas = MockDocMetas;
//# sourceMappingURL=DocMetas.js.map