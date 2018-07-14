const {PagemarkRedrawer} = require("./PagemarkRedrawer");

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 * @Deprecated Remove when we go to the new PagemarkView system
 */
class MainPagemarkRedrawer extends PagemarkRedrawer {

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
        await this.view.recreatePagemarksFromPageElement(pageElement);
    }

}

module.exports.MainPagemarkRedrawer = MainPagemarkRedrawer;
