
const {Preconditions} = require("../../Preconditions");
const log = require("../../logger/Logger").create();

class Container {

    /**
     *
     * @param containerDescriptor {ContainerDescriptor}
     */
    constructor(containerDescriptor) {

        this.containerDescriptor = containerDescriptor;

        /**
         *
         * @type {Array<Component>} The components held within this container.
         */
        this.components = [];



    }

    /**
     * init this container.
     */
    init() {

        log.info("init()")

    }

}

module.exports.Container = Container;








const {Preconditions} = require("../../Preconditions");

/**
 * @Deprecated Remove when we go to the new PagemarkView system
 *
 */
class PagemarkRedrawer {

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

        console.log("PagemarkRedrawer: setup...");

        this.__updatePageElements();

        console.log(`Working with ${this.pageElements.length} elements for selector ${this.pageElementSelector}` );

        this.pageElements.forEach(pageElement => {
            this.init(pageElement);
        });

    }

    __updatePageElements() {
        Preconditions.assertNotNull(this.pageElementSelector, "pageElementSelector");
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

module.exports.PagemarkRedrawer = PagemarkRedrawer;
