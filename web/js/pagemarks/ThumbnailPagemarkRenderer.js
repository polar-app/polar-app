const {PagemarkRenderer} = require("./PagemarkRenderer");

/**
 * Handles attaching pagemarks to the pages (as opposed to thumbnails).
 */
class ThumbnailPagemarkRenderer extends PagemarkRenderer {

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

        pageElement.querySelector(".thumbnailSelectionRing").addEventListener('DOMNodeInserted', function(event) {

            if (event.target && event.target.className === "thumbnailImage") {
                this.__render(pageElement);
            }

        }.bind(this), false );

    }

    __render(pageElement) {

        let templateElement = pageElement.querySelector(".thumbnailImage");

        if( ! templateElement) {
            // the thumbnail tab might not be visible.
            return;
        }

        let options = {zIndex: 1, templateElement, placementElement: templateElement};

        this.view.recreatePagemarksFromPagemarks(pageElement, options);

    }

}

module.exports.ThumbnailPagemarkRenderer = ThumbnailPagemarkRenderer;
