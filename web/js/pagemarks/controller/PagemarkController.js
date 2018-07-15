class PagemarkController {

    /**
     *
     * @param model {Model}
     */
    constructor(model) {
        this.model = model;
    }

    start() {

        window.addEventListener("message", this.onMessageReceived, false);

    }

    onMessageReceived(event) {
        console.log("Got message: " + event);
    }

}

module.exports.PagemarkController = PagemarkController;
