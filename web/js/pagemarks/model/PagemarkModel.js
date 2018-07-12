/**
 *
 */
class PagemarkModel {

    // TODO: it would be ideal if we could either:
    //
    // listen to /pageMetas/pagemarks directly ... and then get the parent that
    // the pagemark contains but the current Proxies system doesn't support that.

    registerListener(docMeta, callback) {

        // TODO: there is a lot of duplication here with TextHighlightModel.js
        // and we should try to unify them.

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            pageMeta.textHighlights.addTraceListener(traceEvent => {

                if(! traceEvent.path.endsWith("/pagemarks")) {
                    return;
                }

                let event = {
                    docMeta,
                    pageMeta,

                    value: traceEvent.value,
                    previousValue: traceEvent.previousValue,

                    mutationType: traceEvent.mutationType,
                    mutationState: traceEvent.mutationState,
                    // and of course the full traceEvent as a raw value for
                    // debug purposes.
                    traceEvent
                };

                callback(event);

                return true;

            }).sync();

        });

    }
}

const {forDict} = require("../../utils.js");

module.exports.PagemarkModel = PagemarkModel;
