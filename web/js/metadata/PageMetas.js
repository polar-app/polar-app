const {Pagemarks} = require("./Pagemarks.js");
const {forDict} = require("../util/Functions");
const {Hashcodes} = require("../Hashcodes");
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

}

module.exports.PageMetas = PageMetas;
