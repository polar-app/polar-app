const $ = require('jquery')
const {EventBridge} = require("./EventBridge");

/**
 * Listens for the iframe to load and then sends the events so that the
 * controllers can see.
 */
class FrameInitializer {

    constructor(iframe, textLayer) {

        if(!iframe) {
            throw new Error("No iframe");
        }

        this.iframe = iframe;
        this.textLayer = textLayer;

    }

    start() {
        $(this.iframe).ready(this.onLoad.bind(this));
    }

    /**
     *
     */
    onLoad() {

        console.log("Frame loaded.  Sending pagesinit on .page");
        this.dispatchPagesInit();
        this.startEventBridge();
    }

    dispatchPagesInit() {

        let event = new Event('pagesinit', {bubbles: true});

        // Dispatch the event.
        document.querySelector(".page").dispatchEvent(event);

    }

    startEventBridge() {
        let eventBridge = new EventBridge(this.textLayer, this.iframe);
        eventBridge.start();
    }

}

module.exports.FrameInitializer = FrameInitializer;
