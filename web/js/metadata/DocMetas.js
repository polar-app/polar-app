"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PageMeta_1 = require("./PageMeta");
const Logger_1 = require("../logger/Logger");
const DocMeta_1 = require("./DocMeta");
const PagemarkType_1 = require("./PagemarkType");
const PageInfo_1 = require("./PageInfo");
const DocInfos_1 = require("./DocInfos");
const AnnotationInfos_1 = require("./AnnotationInfos");
const { Pagemarks } = require("./Pagemarks");
const { MetadataSerializer } = require("./MetadataSerializer");
const { PageMetas } = require("./PageMetas");
const { TextHighlights } = require("./TextHighlights");
const log = Logger_1.Logger.create();
class DocMetas {
    static create(fingerprint, nrPages) {
        let docInfo = DocInfos_1.DocInfos.create(fingerprint, nrPages);
        let pageMetas = {};
        for (let idx = 1; idx <= nrPages; ++idx) {
            let pageInfo = new PageInfo_1.PageInfo({ num: idx });
            let pageMeta = new PageMeta_1.PageMeta({ pageInfo: pageInfo });
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
        let maxPageNum = Math.min(options.offsetPage + options.nrPages - 1, docMeta.docInfo.nrPages);
        for (let pageNum = options.offsetPage; pageNum <= maxPageNum; ++pageNum) {
            let pagemark = Pagemarks.create({
                type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });
            let pageMeta = docMeta.getPageMeta(pageNum);
            pageMeta.pagemarks[pagemark.column] = pagemark;
        }
    }
    static serialize(docMeta, spacing) {
        return MetadataSerializer.serialize(docMeta, spacing);
    }
    static deserialize(data) {
        if (!(typeof data === "string")) {
            throw new Error("We can only deserialize strings: " + typeof data);
        }
        let docMeta = Object.create(DocMeta_1.DocMeta.prototype);
        docMeta = MetadataSerializer.deserialize(docMeta, data);
        return DocMetas.upgrade(docMeta);
    }
    static upgrade(docMeta) {
        docMeta.pageMetas = PageMetas.upgrade(docMeta.pageMetas);
        if (!docMeta.annotationInfo) {
            log.warn("No annotation info.. Adding default.");
            docMeta.annotationInfo = AnnotationInfos_1.AnnotationInfos.create();
        }
        if (docMeta.docInfo) {
            if (!docMeta.docInfo.pagemarkType) {
                log.warn("DocInfo has no pagemarkType... Adding default of SINGLE_COLUMN");
                docMeta.docInfo.pagemarkType = PagemarkType_1.PagemarkType.SINGLE_COLUMN;
            }
        }
        return docMeta;
    }
}
exports.DocMetas = DocMetas;
class MockDocMetas {
    static createWithinInitialPagemarks(fingerprint, nrPages) {
        let result = DocMetas.create(fingerprint, nrPages);
        let maxPages = 3;
        for (let pageNum = 1; pageNum <= Math.min(nrPages, maxPages); ++pageNum) {
            let pagemark = Pagemarks.create({
                type: PagemarkType_1.PagemarkType.SINGLE_COLUMN,
                percentage: 100,
                column: 0
            });
            let pageMeta = result.getPageMeta(pageNum);
            pageMeta.pagemarks[pagemark.column] = pagemark;
        }
        return result;
    }
    static createMockDocMeta() {
        let fingerprint = "0x001";
        let nrPages = 4;
        let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
        let textHighlight = TextHighlights.createMockTextHighlight();
        docMeta.getPageMeta(1).textHighlights[textHighlight.id] = textHighlight;
        return docMeta;
    }
}
exports.MockDocMetas = MockDocMetas;
//# sourceMappingURL=DocMetas.js.map