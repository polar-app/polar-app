"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDocAnnotation = exports.createChildren = void 0;
const Refs_1 = require("polar-shared/src/metadata/Refs");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const DocAnnotations_1 = require("./DocAnnotations");
function createChildren(original, docMeta, pageMeta) {
    return () => {
        const flashcards = Object.values(pageMeta.flashcards || {});
        const comments = Object.values(pageMeta.comments || {});
        function isReferenced(annotation) {
            if (!annotation.ref) {
                return false;
            }
            const parsedRef = Refs_1.Refs.parse(annotation.ref);
            return parsedRef.value === original.id || parsedRef.value === original.guid;
        }
        const flashcardAnnotations = flashcards.filter(isReferenced)
            .map(annotation => DocAnnotations_1.DocAnnotations.createFromFlashcard(docMeta, annotation, pageMeta));
        const commentAnnotations = comments.filter(isReferenced)
            .map(annotation => DocAnnotations_1.DocAnnotations.createFromComment(docMeta, annotation, pageMeta));
        const resolved = [
            ...flashcardAnnotations,
            ...commentAnnotations
        ];
        return resolved;
    };
}
exports.createChildren = createChildren;
class DefaultDocAnnotation {
    constructor(index, obj) {
        this.index = index;
        this.obj = obj;
        this.getIndex = () => index;
        this.oid = obj.oid;
        this.id = obj.id;
        this.guid = obj.guid;
        this.fingerprint = obj.fingerprint;
        this.docInfo = obj.docInfo;
        this.annotationType = obj.annotationType;
        this.text = obj.text;
        this.html = obj.html;
        this.fields = obj.fields;
        this.pageNum = obj.pageNum;
        this.position = obj.position;
        this.created = obj.created;
        this.lastUpdated = obj.lastUpdated || obj.created;
        this.ref = obj.ref;
        this.img = obj.img;
        this.color = obj.color;
        this.docMeta = obj.docMeta;
        this.pageMeta = obj.pageMeta;
        this.original = obj.original;
        this.author = obj.author;
        this.immutable = obj.immutable;
        this.tags = obj.tags;
        this.parent = obj.parent;
        this.docMetaRef = {
            id: obj.docInfo.fingerprint
        };
        this.order = obj.order;
    }
    getChildren() {
        return ArrayStreams_1.arrayStream(this.getIndex()._getChildren(this.id))
            .unique(current => current.id)
            .collect();
    }
    children() {
        return this.getChildren();
    }
    setChildren(children) {
        this.getIndex()._setChildren(this.id, children);
    }
    addChild(docAnnotation) {
        this.getIndex()._addChild(this.id, docAnnotation);
    }
    removeChild(id) {
        this.getIndex()._removeChild(this.id, id);
    }
}
exports.DefaultDocAnnotation = DefaultDocAnnotation;
//# sourceMappingURL=DocAnnotation.js.map