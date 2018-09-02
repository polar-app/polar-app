import {Logger} from '../logger/Logger';
import {PageMeta} from './PageMeta';
import {forDict} from '../util/Functions';
import {Hashcodes} from '../Hashcodes';
import {Pagemarks} from './Pagemarks';
import {DocMeta} from './DocMeta';
import {Preconditions} from '../Preconditions';
import {AnnotationEvent} from '../annotations/components/AnnotationEvent';
import {TraceEvent} from '../proxies/TraceEvent';

const log = Logger.create();

export class PageMetas {

    /**
     * @param pageMetas {Object<int,PageMeta>}
     * @return {Object<int,PageMeta>}
     */
    static upgrade(pageMetas: {[key: number]: PageMeta}) {

        pageMetas = Object.assign({}, pageMetas);

        forDict(pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                log.debug("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, function (key, textHighlight) {
                if(! textHighlight.id) {
                    log.debug("Text highlight given ID");
                    textHighlight.id = Hashcodes.createID(textHighlight.rects);
                }
            });

            if(!pageMeta.areaHighlights) {
                log.debug("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if(!pageMeta.pagemarks) {
                log.debug("No pagemarks.  Assigning default (empty map)");
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
    static createModel(docMeta: DocMeta, memberName: string, callback: (annotationEvent: AnnotationEvent) => void) {

        Preconditions.assertNotNull(docMeta, "docMeta");
        Preconditions.assertNotNull(memberName, "memberName");
        Preconditions.assertNotNull(callback, "callback");

        forDict(docMeta.pageMetas, (key, pageMeta) => {

            let member = pageMeta[memberName];

            if(! member) {
                log.warn("No member for key: " + key, memberName);
            }

            member.addTraceListener((traceEvent: TraceEvent) => {

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
