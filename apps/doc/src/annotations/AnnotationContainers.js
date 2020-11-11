"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationContainers = void 0;
var AnnotationContainers;
(function (AnnotationContainers) {
    function visible(annotationContainers, annotations) {
        function createLookup() {
            const result = [];
            for (const annotationContainer of annotationContainers) {
                result[annotationContainer.pageNum] = annotationContainer;
            }
            return result;
        }
        function toPageAnnotationWithContainer(pageAnnotation) {
            const annotationContainer = lookup[pageAnnotation.pageNum];
            if (annotationContainer) {
                return Object.assign(Object.assign({}, pageAnnotation), { container: annotationContainer.container });
            }
            else {
                return undefined;
            }
        }
        const lookup = createLookup();
        return annotations.map(toPageAnnotationWithContainer)
            .filter(current => current !== undefined)
            .map(current => current);
    }
    AnnotationContainers.visible = visible;
})(AnnotationContainers = exports.AnnotationContainers || (exports.AnnotationContainers = {}));
//# sourceMappingURL=AnnotationContainers.js.map