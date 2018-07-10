const {forDict} = require("../../../utils.js");

class TextHighlightModel {

    registerListener(docMeta, callback) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            // TODO: this is why recursive by default listeners aren't a not a good
            // idea because we can get any object at any depth.
            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

                if(! traceEvent.path.endsWith("/textHighlights")) {
                    // not a new highlight.
                    return;
                }

                let event = {
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

            }.bind(this)).sync();

        }.bind(this));

    }

};

module.exports.TextHighlightModel = TextHighlightModel;
