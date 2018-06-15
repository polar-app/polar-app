const {PagemarkRenderer} = require("./PagemarkRenderer");

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class MainPagemarkRenderer extends PagemarkRenderer {

    constructor(view) {
        super(view);
        this.pageElementSelector = ".page";

    }

    setup() {
        this.__setup();
    }

    __requiresPagemark(pageElement) {
        return pageElement.querySelector("canvas") != null;
    }

    __registerListener(pageElement) {

        // TODO: migrate to using PageRedrawHandler

        pageElement.addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "endOfContent") {
                this.__render(pageElement);
            }

        }.bind(this), false );

    }

    __render(pageElement) {
        this.view.recreatePagemarksFromPagemarks(pageElement);
    }

}

module.exports.MainPagemarkRenderer = MainPagemarkRenderer;
