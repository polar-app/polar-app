const $ = require('jquery')
const {EventBridge} = require("./EventBridge");

/**
 * Listens for the iframe to load and then sends the events to target objects
 * so that that the page started , and then finished loading.  We then
 * dispatched two callbacks onIFrameLoading and onIFrameLoaded.
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

        this.iframe.contentDocument.addEventListener("readystatechange", this.onReadyStateChange.bind(this));

    }

    onReadyStateChange() {

        if(this.iframe.contentDocument.readyState === "complete") {
            console.log("FrameInitializer: Document has finished loading");
            this.onLoad();
        }

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
