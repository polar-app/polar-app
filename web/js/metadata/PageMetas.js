const {Pagemarks} = require("./Pagemarks.js");
const {forDict} = require("../utils");

class PageMetas {

    /**
     * @param pageMetas {Array<PageMeta>}
     * @return {Array<PageMeta>}
     */
    static upgrade(pageMetas) {

        pageMetas = Object.assign({}, pageMetas);

        forDict(pageMetas, function (key, pageMeta) {

            if(!pageMeta.textHighlights) {
                console.warn("No textHighlights.  Assigning default.");
                pageMeta.textHighlights = {};
            }

            // make sure legacy / old text highlights are given IDs.
            forDict(pageMeta.textHighlights, function (key, textHighlight) {
                if(! textHighlight.id) {
                    console.warn("Text highlight given ID");
                    textHighlight.id = Hashcodes.createID(textHighlight.rects);
                }
            });

            if(!pageMeta.areaHighlights) {
                console.warn("No areaHighlights.  Assigning default.");
                pageMeta.areaHighlights = {};
            }

            if(!pageMeta.pagemarks) {
                console.warn("No pagemarks.  Assigning default.");
                pageMeta.pagemarks = {};
            }

            // call pageMeta.pagemarks = Pagemarks.upgrade(pageMeta.pagemarks)

            forDict(pageMeta.pagemarks, function (key, pagemark) {
                if(! pagemark.id) {
                    console.warn("Pagemark given ID");
                    pagemark.id = Pagemarks.createID(pagemark.created);
                }
            });

        } );

        return pageMetas;

    }

}

module.exports.PageMetas = PageMetas;
