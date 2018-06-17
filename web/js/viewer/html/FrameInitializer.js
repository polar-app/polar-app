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
        this.loaded = false;

    }

    start() {

        this.iframe.contentDocument.addEventListener("readystatechange", this.onReadyStateChange.bind(this));
        this._checkLoaded();

    }

    _checkLoaded() {

        if(!this.loaded) {
            this.loaded = true;
            this.onLoad();
            console.log("FrameInitializer: Document has finished loading");
        }

    }

    onReadyStateChange() {

        if(this.iframe.contentDocument.readyState === "complete") {
            this._checkLoaded();
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
