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
exports.DocAnnotations = void 0;
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const DocAnnotation_1 = require("./DocAnnotation");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Flashcards_1 = require("../metadata/Flashcards");
const ObjectIDs_1 = require("../util/ObjectIDs");
const Images_1 = require("../metadata/Images");
const Providers_1 = require("polar-shared/src/util/Providers");
const AnnotationTexts_1 = require("polar-shared/src/metadata/AnnotationTexts");
const HighlightColor_1 = require("polar-shared/src/metadata/HighlightColor");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const InheritedTags_1 = require("polar-shared/src/tags/InheritedTags");
const Refs_1 = require("polar-shared/src/metadata/Refs");
var DocAnnotations;
(function (DocAnnotations) {
    function toRef(docAnnotation) {
        const children = docAnnotation.children().map(toRef);
        const docMetaRef = {
            id: docAnnotation.docMeta.docInfo.fingerprint
        };
        const tmp = Object.assign({}, docAnnotation);
        delete tmp.docMeta;
        delete tmp.docInfo;
        delete tmp.pageMeta;
        delete tmp.index;
        delete tmp.obj;
        delete tmp.oid;
        delete tmp.getIndex;
        const result = Object.assign(Object.assign({}, tmp), { docMetaRef, children: () => children });
        return result;
    }
    DocAnnotations.toRef = toRef;
    function isImmutable(author) {
        if (author && author.guest) {
            return true;
        }
        return false;
    }
    function getAnnotationsForPage(docFileResolver, docAnnotationIndex, docMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const pageMetas = Object.values(docMeta.pageMetas);
            for (const pageMeta of pageMetas) {
                const areaHighlights = yield getAreaHighlights(docFileResolver, docMeta, pageMeta);
                const textHighlights = getTextHighlights(docMeta, pageMeta);
                result.push(...textHighlights);
                result.push(...areaHighlights);
            }
            return result;
        });
    }
    DocAnnotations.getAnnotationsForPage = getAnnotationsForPage;
    function createFromFlashcard(docMeta, annotation, pageMeta) {
        const textConverter = ITextConverters.create(AnnotationType_1.AnnotationType.FLASHCARD, annotation);
        const init = createInit(docMeta);
        const parent = annotation.ref ? Refs_1.Refs.parse(annotation.ref) : undefined;
        return Object.assign(Object.assign(Object.assign(Object.assign({}, init), { oid: ObjectIDs_1.ObjectIDs.create(), id: annotation.id, guid: annotation.guid, fingerprint: docMeta.docInfo.fingerprint, docInfo: docMeta.docInfo }), textConverter), { fields: Flashcards_1.Flashcards.convertFieldsToMap(annotation.fields), pageNum: pageMeta.pageInfo.num, position: {
                x: 0,
                y: 0
            }, created: annotation.created, lastUpdated: annotation.lastUpdated || annotation.created, docMeta,
            pageMeta, ref: annotation.ref, parent, original: annotation, author: annotation.author, immutable: isImmutable(annotation.author), color: undefined, img: undefined, tags: Object.assign(Object.assign({}, InheritedTags_1.toSelfInheritedTags(annotation.tags)), init.tags), children: () => [], docMetaRef: {
                id: docMeta.docInfo.fingerprint
            }, order: undefined });
    }
    DocAnnotations.createFromFlashcard = createFromFlashcard;
    function createFromComment(docMeta, annotation, pageMeta) {
        const iTextConverter = ITextConverters.create(AnnotationType_1.AnnotationType.COMMENT, annotation);
        const init = createInit(docMeta);
        const parent = annotation.ref ? Refs_1.Refs.parse(annotation.ref) : undefined;
        return Object.assign(Object.assign(Object.assign(Object.assign({}, init), { oid: ObjectIDs_1.ObjectIDs.create(), id: annotation.id, guid: annotation.guid, fingerprint: docMeta.docInfo.fingerprint, docInfo: docMeta.docInfo }), iTextConverter), { pageNum: pageMeta.pageInfo.num, position: {
                x: 0,
                y: 0
            }, created: annotation.created, lastUpdated: annotation.lastUpdated || annotation.created, docMeta,
            pageMeta, ref: annotation.ref, parent, original: annotation, author: annotation.author, immutable: isImmutable(annotation.author), color: undefined, img: undefined, tags: Object.assign(Object.assign({}, InheritedTags_1.toSelfInheritedTags(annotation.tags)), init.tags), children: () => [], docMetaRef: {
                id: docMeta.docInfo.fingerprint
            }, order: undefined });
    }
    DocAnnotations.createFromComment = createFromComment;
    function createFromAreaHighlight(docFileResolver, docMeta, annotation, pageMeta) {
        const createPosition = () => {
            if (annotation.position) {
                return Object.assign({}, annotation.position);
            }
            return {
                x: firstRect(annotation).map(current => current.left).getOrElse(0),
                y: firstRect(annotation).map(current => current.top).getOrElse(0),
            };
        };
        const img = Providers_1.Providers.memoize(() => Images_1.Images.toImg(docFileResolver, annotation.image));
        const position = createPosition();
        const init = createInit(docMeta);
        const children = DocAnnotation_1.createChildren(annotation, docMeta, pageMeta);
        return Object.assign(Object.assign({}, init), { oid: ObjectIDs_1.ObjectIDs.create(), id: annotation.id, guid: annotation.guid, fingerprint: docMeta.docInfo.fingerprint, docInfo: docMeta.docInfo, annotationType: AnnotationType_1.AnnotationType.AREA_HIGHLIGHT, get img() {
                return img();
            }, text: undefined, html: undefined, pageNum: pageMeta.pageInfo.num, position, color: HighlightColor_1.HighlightColors.withDefaultColor(annotation.color), created: annotation.created, lastUpdated: annotation.lastUpdated || annotation.created, docMeta,
            pageMeta, ref: undefined, parent: undefined, original: annotation, author: annotation.author, tags: Object.assign(Object.assign({}, InheritedTags_1.toSelfInheritedTags(annotation.tags)), init.tags), immutable: isImmutable(annotation.author), children, docMetaRef: {
                id: docMeta.docInfo.fingerprint
            }, order: annotation.order });
    }
    DocAnnotations.createFromAreaHighlight = createFromAreaHighlight;
    function createFromTextHighlight(docMeta, annotation, pageMeta) {
        const iTextConverter = ITextConverters.create(AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT, annotation);
        const init = createInit(docMeta);
        const children = DocAnnotation_1.createChildren(annotation, docMeta, pageMeta);
        return Object.assign(Object.assign(Object.assign(Object.assign({}, init), { oid: ObjectIDs_1.ObjectIDs.create(), id: annotation.id, guid: annotation.guid, fingerprint: docMeta.docInfo.fingerprint, docInfo: docMeta.docInfo }), iTextConverter), { pageNum: pageMeta.pageInfo.num, position: {
                x: firstRect(annotation).map(current => current.left).getOrElse(0),
                y: firstRect(annotation).map(current => current.top).getOrElse(0),
            }, color: HighlightColor_1.HighlightColors.withDefaultColor(annotation.color), created: annotation.created, lastUpdated: annotation.lastUpdated || annotation.created, docMeta,
            pageMeta, ref: undefined, parent: undefined, original: annotation, author: annotation.author, immutable: isImmutable(annotation.author), tags: Object.assign(Object.assign({}, InheritedTags_1.toSelfInheritedTags(annotation.tags)), init.tags), img: undefined, children, docMetaRef: {
                id: docMeta.docInfo.fingerprint
            }, order: annotation.order });
    }
    DocAnnotations.createFromTextHighlight = createFromTextHighlight;
    function getTextHighlights(docMeta, pageMeta) {
        const textHighlights = Object.values(pageMeta.textHighlights);
        return textHighlights.map(textHighlight => {
            return createFromTextHighlight(docMeta, textHighlight, pageMeta);
        });
    }
    function getAreaHighlights(docFileResolver, docMeta, pageMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            const areaHighlights = Object.values(pageMeta.areaHighlights);
            for (const areaHighlight of areaHighlights) {
                const docAnnotation = yield createFromAreaHighlight(docFileResolver, docMeta, areaHighlight, pageMeta);
                result.push(docAnnotation);
            }
            return result;
        });
    }
    function createInit(docMeta) {
        const toInheritedTag = (tag) => {
            return Object.assign({ source: 'doc' }, tag);
        };
        const tags = ArrayStreams_1.arrayStream(Object.values(docMeta.docInfo.tags || {}))
            .map(toInheritedTag)
            .toMap(current => current.id);
        return {
            tags: Object.assign({}, tags)
        };
    }
    function firstRect(highlight) {
        return Optional_1.Optional.of(highlight)
            .map(current => current.rects)
            .map(current => current[0]);
    }
})(DocAnnotations = exports.DocAnnotations || (exports.DocAnnotations = {}));
class ITextConverters {
    static create(annotationType, annotation) {
        const toText = Providers_1.Providers.memoize(() => AnnotationTexts_1.AnnotationTexts.toText(annotationType, annotation));
        const toHTML = Providers_1.Providers.memoize(() => AnnotationTexts_1.AnnotationTexts.toHTML(annotationType, annotation));
        return {
            annotationType,
            get text() {
                return toText();
            },
            get html() {
                return toHTML();
            },
        };
    }
}
//# sourceMappingURL=DocAnnotations.js.map