const {Elements} = require("../util/Elements");

/**
 * Get the proper docFormat to work with.
 */
class DocFormat {

    currentScale() {
        return 1.0;
    }

    getPageNumFromPageElement(pageElement) {
        let dataPageNum = pageElement.getAttribute("data-page-number");
        return parseInt(dataPageNum);
    }

    getPageElementFromPageNum(pageNum) {

        if(!pageNum) {
            throw new Error("Page number not specified");
        }

        let pageElements = document.querySelectorAll(".page");

        // note that elements are 0 based indexes but our pages are 1 based
        // indexes.
        let pageElement = pageElements[pageNum - 1];

        if(pageElement == null) {
            throw new Error("Unable to find page element for page num: " + pageNum);
        }

        return pageElement;

    }

    /**
     * Get the current page number based on which page is occupying the largest
     * percentage of the viewport.
     */
    getCurrentPageElement() {

        let pages = document.querySelectorAll(".page");

        let result = { element: null, visibility: 0};

        pages.forEach(function (page) {
            let visibility = Elements.calculateVisibilityForDiv(page);

            if ( visibility > result.visibility) {
                result.element = page;
                result.visibility = visibility;
            }

        });

        return result.element;

    }

    /**
     * Get all the metadata about the current page.
     */
    getCurrentPageMeta() {

        let pageElement = this.getCurrentPageElement();
        let pageNum = this.getPageNumFromPageElement(pageElement);

        return { pageElement, pageNum }

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    currentDocFingerprint() {

    }

    /**
     * Get the current state of the doc.
     */
    currentState(event) {

    }

    supportThumbnails() {
        return false;
    }

    /**
     * Pagemark options for this viewer.
     *
     * @return {{}}
     */
    pagemarkOptions() {
        return {

        };
    }

    textHighlightOptions() {
        return {};
    }
}

module.exports.DocFormat = DocFormat;
