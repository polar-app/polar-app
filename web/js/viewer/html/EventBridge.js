const log = require("../../logger/Logger").create();

/**
 * Moves events from the iframe, into the target document. This allows the event
 * listeners to see the event as if it was called inside the parent .page
 * in the parent DOM window.
 */
class EventBridge {

    constructor(targetElement, iframe) {
        this.targetElement = targetElement;
        this.iframe = iframe;
    }

    start() {

        // TODO/FIXME: the child iframes within this iframe / recursively also
        // need to be configured.

        this.addListeners(this.iframe);

        this.iframe.parentElement.addEventListener('DOMNodeInserted', (event) => this.elementInsertedListener(event), false);

        log.info("Event bridge started on: ", this.iframe.contentDocument.location.href);

    }

    elementInsertedListener(event) {

        log.info("elementInsertedListener event: " , event)

        if (event.target && event.target.tagName === "IFRAME") {
            log.info("Main iframe re-added.  Registering event listeners again");
            let iframe = event.target;
            this.addListeners(iframe);
        }

    }

    addListeners(iframe) {

        iframe.contentDocument.body.addEventListener("keyup", this.eventListener.bind(this));
        iframe.contentDocument.body.addEventListener("keydown", this.eventListener.bind(this));
        iframe.contentDocument.body.addEventListener("mouseup", this.eventListener.bind(this));
        iframe.contentDocument.body.addEventListener("mousedown", this.eventListener.bind(this));
        iframe.contentDocument.body.addEventListener("contextmenu", this.eventListener.bind(this));

        iframe.contentDocument.body.addEventListener("click", function(event) {

            let anchor = this.getAnchor(event.target);

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
                this.eventListener(event);
            }

        }.bind(this));

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

    eventListener(event) {
        let newEvent = new event.constructor(event.type, event)

        this.targetElement.dispatchEvent(newEvent);
    }

}

module.exports.EventBridge = EventBridge;
