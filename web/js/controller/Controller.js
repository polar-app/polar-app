
class Controller {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {

        if(! model) {
            throw new Error("No model");
        }

        /**
         *
         * @type {Model}
         */
        this.model = model;
    }

    /**
     * Called when a new document has been loaded.
     */
    async onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {
        await this.model.documentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
    }

    /**
     * Mark the given page number as read.
     */
    async createPagemark(pageNum, options) {
        console.log("Controller sees pagemark created: " + pageNum, options);
        await this.model.createPagemark(pageNum, options);
    }

    erasePagemarks(pageNum, options) {
        console.log("Controller sees pagemarks erased: " + pageNum);
        this.model.erasePagemark(pageNum, options);
    }

    /**
     * Mark the given page number as read.
     */
    erasePagemark(num) {
        console.log("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }

    getCurrentPageElement() {

    }

};

module.exports.Controller = Controller;
