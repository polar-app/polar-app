const {PagemarkComponent} = require("./PagemarkRedrawer");

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class ThumbnailPagemarkRedrawer extends PagemarkComponent {

    /**
     *
     * @param view {WebView}
     */
    constructor(view) {
        super(view);
        this.pageElementSelector = ".thumbnail";
    }

    setup() {
        this.__setup();
    }

    __requiresPagemark(pageElement) {
        let thumbnailImage = pageElement.querySelector(".thumbnailImage");
        return thumbnailImage != null && thumbnailImage.getAttribute("src") != null;
    }

    __registerListener(pageElement) {

        pageElement.querySelector(".thumbnailSelectionRing").addEventListener('DOMNodeInserted', event => {

            if (event.target && event.target.className === "thumbnailImage") {
                this.__render(pageElement);
            }

        }, false );

    }

    __render(pageElement) {

        let templateElement = pageElement.querySelector(".thumbnailImage");

        if( ! templateElement) {
            // the thumbnail tab might not be visible.
            return;
        }

        let options = {zIndex: 1, templateElement, placementElement: templateElement};

        this.view.recreatePagemarksFromPageElement(pageElement, options);

    }

}

module.exports.ThumbnailPagemarkRedrawer = ThumbnailPagemarkRedrawer;
