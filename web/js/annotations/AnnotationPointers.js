
const {AnnotationPointer} = require("./AnnotationPointer");

class AnnotationPointers {

    /**
     *
     * @param selector {string} The CSS selector for this annotation.
     * @param contextMenuEvent
     * @return {Array<AnnotationPointer>}
     */
    static toAnnotationPointers(selector, contextMenuEvent) {

        let result = [];

        // should we just send this event to all the the windows?
        contextMenuEvent.matchingSelectors[selector].annotationDescriptors.forEach(annotationDescriptor => {

            console.log("FIXME: annotationDescriptor", annotationDescriptor);

            let annotationPointer = new AnnotationPointer({
                pageNum: annotationDescriptor.pageNum,
                id: annotationDescriptor.annotationId
            });

            result.push(annotationPointer);

        });

        return result;

    }

}

module.exports.AnnotationPointers = AnnotationPointers;
