const {AnnotationEvent} = require("../../annotations/components/AnnotationEvent");
const {forDict} = require("../../utils.js");

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

            pageMeta.pagemarks.addTraceListener(traceEvent => {

                if(! traceEvent.path.endsWith("/pagemarks")) {
                    return;
                }

                let annotationEvent = new AnnotationEvent(Object.assign({}, traceEvent, {
                    docMeta,
                    pageMeta,
                }));

                callback(annotationEvent);

                return true;

            }).sync();

        });

    }

}

module.exports.PagemarkModel = PagemarkModel;
