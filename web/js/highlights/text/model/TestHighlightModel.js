const {forDict} = require("../../../utils.js");

module.exports.TextHighlightModel = class {

    registerListener(docMeta, callback) {

        forDict(docMeta.pageMetas, function (key, pageMeta) {

            pageMeta.textHighlights.addTraceListener(function (traceEvent) {

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

            }.bind(this)).fireInitial();

        }.bind(this));

    }

};
