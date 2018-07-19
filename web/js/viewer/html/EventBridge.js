const {FrameEvents} = require("./FrameEvents");
const log = require("../../logger/Logger").create();

/**
 * Moves events from the iframe, into the target document. This allows the event
 * listeners to see the event as if it was called inside the parent .page
 * in the parent DOM window.
 */
class EventBridge {

    /**
     *
     * @param targetElement
     * @param iframe {HTMLIFrameElement}
     */
    constructor(targetElement, iframe) {
        this.targetElement = targetElement;

        /**
         * @type {HTMLIFrameElement}
         */
        this.iframe = iframe;
    }

    start() {

        // TODO/FIXME: the child iframes within this iframe / recursively also
        // need to be configured.

        this.iframe.addEventListener("load", () => this.addListeners(this.iframe));

        this.iframe.parentElement.addEventListener('DOMNodeInserted', (event) => this.elementInsertedListener(event), false);

        //this.addListeners(this.iframe);

        log.info("Event bridge started on: ", this.iframe.contentDocument.location.href);

    }

    elementInsertedListener(event) {

        log.info("elementInsertedListener event: " , event)

        if (event && event.target && event.target.tagName === "IFRAME") {
            log.info("Main iframe re-added.  Registering event listeners again");
            let iframe = event.target;
            this.addListeners(iframe);
        }

    }

    addListeners(iframe) {

        if(! iframe.contentDocument) {
            return;
        }

        iframe.contentDocument.body.addEventListener("keyup", this.keyListener.bind(this));
        iframe.contentDocument.body.addEventListener("keydown", this.keyListener.bind(this));

        iframe.contentDocument.body.addEventListener("mouseup", this.mouseListener.bind(this));
        iframe.contentDocument.body.addEventListener("mousedown", this.mouseListener.bind(this));
        iframe.contentDocument.body.addEventListener("contextmenu", this.mouseListener.bind(this));

        iframe.contentDocument.body.addEventListener("click", event => {

            let anchor = this.getAnchor(event.target);

            // TODO: this needs to be reworked. This isn't the appropriate way
            // to handle this.  I'm going to have to think about which "actions"
            // must be handled by Polar and which ones we allow to be handled
            // by the PHZ.  All Polar actions should call preventDefault and
            // should preventDefault and not sent to the PHZ.

            if(anchor) {
                log.info("Link click prevented.");
                event.preventDefault();

                let href = anchor.href;

                if(href && (href.startsWith("http:") || href.startsWith("https:"))) {
                    // this is a bit of a hack but basically we listen for URLs
                    // in the iframe and change the main page. This triggers our
                    // electron 'will-navigate' which which prevents it and then
                    // opens the URL in the native browser.
                    document.location.href = href;
                }

            } else {
                this.mouseListener(event);
            }

        });

    }

    /**
     * Get the anchor for an element. An event target might be nested in an
     * anchor.
     */
    getAnchor(element) {

        if(element == null) {
            return null;
        }

        if(element.tagName === "A") {
            return element;
        }

        return this.getAnchor(element.parentElement);

    }

    mouseListener(event) {

        let eventPoints = FrameEvents.calculatePoints(this.iframe, event);

        let newEvent = new event.constructor(event.type, event);

        Object.defineProperty(newEvent, "pageX", {value: eventPoints.page.x});
        Object.defineProperty(newEvent, "pageY", {value: eventPoints.page.y});

        Object.defineProperty(newEvent, "clientX", {value: eventPoints.client.x});
        Object.defineProperty(newEvent, "clientY", {value: eventPoints.client.y});

        Object.defineProperty(newEvent, "offsetX", {value: eventPoints.offset.x});
        Object.defineProperty(newEvent, "offsetY", {value: eventPoints.offset.y});

        if(newEvent.pageX !== eventPoints.page.x) {
            throw new Error("Define of properties failed");
        }

        this.targetElement.dispatchEvent(newEvent);

    }

    keyListener(event) {

        let newEvent = new event.constructor(event.type, event);

        this.targetElement.dispatchEvent(newEvent);

    }

}

module.exports.EventBridge = EventBridge;
