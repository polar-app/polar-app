
class PagemarkRenderer {

    /**
     *
     * @param view {WebView}
     */
    constructor(view) {

        /**
         * @type {WebView}
         */
        this.view = view;

        this.pageElements = [];

        // the CSS selector for pulling out the right pageElements.
        this.pageElementSelector = null;

    }

    setup() {

    }

    __setup() {
        console.log("PagemarkRenderer: setup...");

        this.__updatePageElements();

        console.log(`Working with ${this.pageElements.length} elements for selector ${this.pageElementSelector}` );

        this.pageElements.forEach(pageElement => {
            this.init(pageElement);
        });

    }

    __updatePageElements() {
        this.pageElements = document.querySelectorAll(this.pageElementSelector);
    }

    init(pageElement) {

        console.log("Initializing pageElement: ", pageElement);

        if(this.__requiresPagemark(pageElement)) {
            this.__render(pageElement);
        }

        this.__registerListener(pageElement);

    }

    /**
     * Return true if the target needs a pagemark.
     */
    __requiresPagemark(pageElement) {

    }

    /**
     * Register future listeners to monitor status.
     */
    __registerListener(pageElement) {

    }

    __render(pageElement) {
    }

    /**
     * Erase the page elements on the give page number.
     */
    create(pageNum, pagemark) {

        if(typeof pageNum !== "number") {
            throw new Error("pageNum is not a number");
        }

        if(!pagemark) {
            throw new Error("No pagemark.");
        }

        this.__updatePageElements();

        let pageElement = this.pageElements[pageNum-1];

        if(!pageElement) {
            throw new Error(`No pageElement for pageNum ${pageNum} out of ${this.pageElements.length} pageElements`);
        }

        this.__render(pageElement);
    }

    /**
     * Erase the pagemarks on the give page number.
     */
    erase(pageNum) {

        if(typeof pageNum !== "number") {
            throw new Error("pageNum is not a number");
        }

        this.__updatePageElements();

        let pageElement = this.pageElements[pageNum-1];

        if(!pageElement) {
            throw new Error(`No pageElement for pageNum ${pageNum} out of ${this.pageElements.length} pageElements`);
        }

        this.view.erasePagemarks(pageElement);
    }

}

module.exports.PagemarkRenderer = PagemarkRenderer;
