"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../logger/Logger");
const Functions_1 = require("../util/Functions");
const Hashcodes_1 = require("../Hashcodes");
const Pagemarks_1 = require("./Pagemarks");
const Preconditions_1 = require("../Preconditions");
const AnnotationEvent_1 = require("../annotations/components/AnnotationEvent");
const log = Logger_1.Logger.create();
class PageMetas {
    static upgrade(pageMetas) {
        pageMetas = Object.assign({}, pageMetas);
        Functions_1.forDict(pageMetas, function (key, pageMeta) {
            if (!pageMeta.textHighlights) {
                log.warn("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }
            Functions_1.forDict(pageMeta.textHighlights, function (key, textHighlight) {
                if (!textHighlight.id) {
                    log.warn("Text highlight given ID");
                    textHighlight.id = Hashcodes_1.Hashcodes.createID(textHighlight.rects);
                }
            });
            if (!pageMeta.areaHighlights) {
                log.warn("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }
            if (!pageMeta.pagemarks) {
                log.warn("No pagemarks.  Assigning default (empty map)");
                pageMeta.pagemarks = {};
            }
            pageMeta.pagemarks = Pagemarks_1.Pagemarks.upgrade(pageMeta.pagemarks);
        });
        return pageMetas;
    }
    static createModel(docMeta, memberName, callback) {
        Preconditions_1.Preconditions.assertNotNull(docMeta, "docMeta");
        Preconditions_1.Preconditions.assertNotNull(memberName, "memberName");
        Preconditions_1.Preconditions.assertNotNull(callback, "callback");
        Functions_1.forDict(docMeta.pageMetas, (key, pageMeta) => {
            let member = pageMeta[memberName];
            if (!member) {
                log.warn("No member for key: " + key, memberName);
            }
            member.addTraceListener((traceEvent) => {
                if (!traceEvent.path.endsWith("/" + memberName)) {
                    return;
                }
                let annotationEvent = new AnnotationEvent_1.AnnotationEvent(Object.assign({}, traceEvent, {
                    docMeta,
                    pageMeta,
                }));
                callback(annotationEvent);
                return true;
            }).sync();
        });
    }
}
exports.PageMetas = PageMetas;
//# sourceMappingURL=PageMetas.js.map