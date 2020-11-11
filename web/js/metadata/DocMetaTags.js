"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaTags = void 0;
class DocMetaTags {
    static toTags(docMeta) {
        class TagIndex {
            constructor() {
                this.tags = {};
            }
            registerTags(tags) {
                if (!tags) {
                    return;
                }
                for (const tag of Object.values(tags || {})) {
                    this.tags[tag.label] = tag.label;
                }
            }
            registerAnnotations(annotations) {
                for (const annotation of Object.values(annotations || {})) {
                    index.registerTags(annotation.tags);
                }
            }
            toTags() {
                return Object.values(this.tags);
            }
        }
        const index = new TagIndex();
        index.registerTags(docMeta.docInfo.tags);
        for (const pageInfo of Object.values(docMeta.pageMetas || {})) {
            index.registerAnnotations(pageInfo.textHighlights);
            index.registerAnnotations(pageInfo.areaHighlights);
            index.registerAnnotations(pageInfo.flashcards);
        }
        return index.toTags();
    }
}
exports.DocMetaTags = DocMetaTags;
//# sourceMappingURL=DocMetaTags.js.map