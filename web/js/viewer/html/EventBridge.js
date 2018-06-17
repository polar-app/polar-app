
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

        this.iframe.contentDocument.body.addEventListener("keyup", this.eventListener.bind(this));
        this.iframe.contentDocument.body.addEventListener("keydown", this.eventListener.bind(this));
        this.iframe.contentDocument.body.addEventListener("click", this.eventListener.bind(this));

        console.log("Event bridge started on: ", this.iframe.contentDocument.location.href);

    }

    eventListener(event) {
        let newEvent = new event.constructor(event.type, event)

        this.targetElement.dispatchEvent(newEvent);
    }

}

module.exports.EventBridge = EventBridge;
