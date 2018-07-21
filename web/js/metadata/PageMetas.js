const {Pagemarks} = require("./Pagemarks.js");
const {forDict} = require("../util/Functions");
const {Preconditions} = require("../Preconditions");
const {Hashcodes} = require("../Hashcodes");
const {AnnotationEvent} = require("../annotations/components/AnnotationEvent");

const log = require("../logger/Logger").create();


class PageMetas {

    /**
     * @param pageMetas {Object<int,PageMeta>}
     * @return {Object<int,PageMeta>}
     */
    static upgrade(pageMetas) {

        pageMetas = Object.assign({}, pageMetas);

        forDict(pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                log.warn("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, function (key, textHighlight) {
                if(! textHighlight.id) {
                    log.warn("Text highlight given ID");
                    textHighlight.id = Hashcodes.createID(textHighlight.rects);
                }
            });

            if(!pageMeta.areaHighlights) {
                log.warn("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if(!pageMeta.pagemarks) {
                log.warn("No pagemarks.  Assigning default (empty map)");
                pageMeta.pagemarks = {};
            }

            pageMeta.pagemarks = Pagemarks.upgrade(pageMeta.pagemarks);

        } );

        return pageMetas;

    }

    /**
     * Create a model for a specific key within PageMetas.
     *
     * @param docMeta {DocMeta}
     * @param memberName {string}
     * @param callback {Function}
     */
    static createModel(docMeta, memberName, callback) {

        Preconditions.assertNotNull(docMeta, "docMeta");
        Preconditions.assertNotNull(memberName, "memberName");
        Preconditions.assertNotNull(callback, "callback");

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            let member = pageMeta[memberName];

            if(! member) {
                log.warn("No member for key: " + key, memberName);
            }

            member.addTraceListener(traceEvent => {

                if(! traceEvent.path.endsWith("/" + memberName)) {
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

module.exports.PageMetas = PageMetas;
