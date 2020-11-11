"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageAnnotations = void 0;
const DocMetas_1 = require("../../../../web/js/metadata/DocMetas");
const Numbers_1 = require("polar-shared/src/util/Numbers");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var PageAnnotations;
(function (PageAnnotations) {
    function compute(docMeta, annotationProvider) {
        const pages = Numbers_1.Numbers.range(1, docMeta.docInfo.nrPages);
        return ArrayStreams_1.arrayStream(pages)
            .map((pageNum) => {
            const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, pageNum);
            const annotations = annotationProvider(pageMeta);
            return annotations.map(annotation => {
                return {
                    fingerprint: docMeta.docInfo.fingerprint,
                    pageNum, annotation
                };
            });
        })
            .flatMap(current => current)
            .collect();
    }
    PageAnnotations.compute = compute;
})(PageAnnotations = exports.PageAnnotations || (exports.PageAnnotations = {}));
//# sourceMappingURL=PageAnnotations.js.map