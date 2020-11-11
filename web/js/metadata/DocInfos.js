"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocInfos = void 0;
const DocInfo_1 = require("./DocInfo");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const UUIDs_1 = require("./UUIDs");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
class DocInfos {
    static create(fingerprint, nrPages, filename) {
        const tmp = Object.create(DocInfos.prototype);
        tmp.fingerprint = fingerprint;
        tmp.nrPages = nrPages;
        tmp.added = ISODateTimeStrings_1.ISODateTimeStrings.create();
        tmp.filename = filename;
        tmp.uuid = UUIDs_1.UUIDs.create();
        return new DocInfo_1.DocInfo(tmp);
    }
    static bestTitle(docInfo) {
        return Optional_1.Optional.first(docInfo.title, docInfo.filename)
            .validateString()
            .getOrElse('Untitled');
    }
    static upgrade(docInfo) {
        if (!docInfo) {
            return docInfo;
        }
        if (!docInfo.attachments) {
            docInfo.attachments = {};
        }
        if (!docInfo.pagemarkType) {
            docInfo.pagemarkType = PagemarkType_1.PagemarkType.SINGLE_COLUMN;
        }
        return docInfo;
    }
}
exports.DocInfos = DocInfos;
//# sourceMappingURL=DocInfos.js.map