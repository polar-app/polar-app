const {DocMetaModel} = require("../../../metadata/DocMetaModel");
const {forDict} = require("../../../utils.js");

class TextHighlightModel extends DocMetaModel {

    registerListener(docMeta, callback) {

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            // TODO: this is why recursive by default listeners aren't a not a good
            // idea because we can get any object at any depth.
            pageMeta.textHighlights.addTraceListener(traceEvent => {

                if(! traceEvent.path.endsWith("/textHighlights")) {
                    // not a new highlight.
                    return;
                }

                let id;

                if(traceEvent.value) {
                    id = traceEvent.value.id;
                } else {
                    id = traceEvent.previousValue.id;
                }

                // FIXME: migrate to AnnotationEvent

                let event = {
                    id,
                    docMeta,
                    pageMeta,

                    // deprecated: use value and previousValue
                    textHighlight: traceEvent.value,
                    // deprecated: use value and previousValue
                    previousTextHighlight: traceEvent.previousValue,

                    value: traceEvent.value,
                    previousValue: traceEvent.previousValue,

                    mutationType: traceEvent.mutationType,
                    mutationState: traceEvent.mutationState,
                    // and of course the full traceEvent as a raw value.
                    traceEvent
                };

                callback(event);

                return true;

            }).sync();

        });

    }

}

module.exports.TextHighlightModel = TextHighlightModel;
