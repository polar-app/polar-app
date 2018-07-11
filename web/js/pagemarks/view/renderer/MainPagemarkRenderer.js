const {PagemarkRenderer} = require("./PagemarkRenderer");

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class MainPagemarkRenderer extends PagemarkRenderer {

    /**
     *
     * @param view {WebView}
     */
    constructor(view) {
        super(view);
        this.pageElementSelector = ".page";

    }

    setup() {
        this.__setup();
    }

    __requiresPagemark(pageElement) {
        return pageElement.querySelector("canvas") != null || pageElement.querySelector("iframe");
    }

    __registerListener(pageElement) {

        // TODO: migrate to using PageRedrawHandler

        pageElement.addEventListener('DOMNodeInserted', async (event) => {

            if (event.target && event.target.className === "endOfContent") {
                await this.__render(pageElement);
            }

        }, false );

    }

    async __render(pageElement) {
        await this.view.recreatePagemarksFromPagemarks(pageElement);
    }

}

module.exports.MainPagemarkRenderer = MainPagemarkRenderer;
