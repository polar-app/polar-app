/**
 * Moves events from the iframe, into the target element. This allows the event
 * listeners to see the event as if it was called inside the parent .page in the
 * parent DOM window.
 */
import {IFrames} from "polar-shared/src/util/IFrames";

export namespace IFrameEventForwarder {

    export function start(iframe: HTMLIFrameElement, target: HTMLElement) {

        if (! iframe) {
            throw new Error("No iframe given");
        }

        if (! iframe.parentElement) {
            throw new Error("No parent for iframe");
        }

        function handleContentDocument() {

            if (! iframe.contentDocument) {
                throw new Error("No contentDocument for iframe");
            }

            iframe.contentDocument.body.addEventListener("keyup", event => handleKeyboardEvent(event, target));
            iframe.contentDocument.body.addEventListener("keydown", event => handleKeyboardEvent(event, target));
            iframe.contentDocument.body.addEventListener("keypress", event => handleKeyboardEvent(event, target));

        }

        IFrames.waitForLoad(iframe)
            .then(handleContentDocument)
            .catch(err => console.error("Unable to handle iframe: ", err));

    }

    enum EventForwardType {

        /**
         * Forward the event to the main window.
         */
        FORWARD,

        /**
         * Default handling for the event.
         */
        DEFAULT

    }

    function computeType(event: KeyboardEvent): EventForwardType {

        // cut / copy / paste
        function isCopy() {
            return ['c', 'x', 'v'].includes(event.key) && (event.metaKey || event.ctrlKey);
        }

        if (isCopy()) {
            return EventForwardType.DEFAULT;
        }

        return EventForwardType.FORWARD;

    }

    function handleKeyboardEvent(event: KeyboardEvent, target: HTMLElement) {
        const type = computeType(event);
        if (type === EventForwardType.FORWARD) {
            forwardKeyboardEvent(event, target);
        }
    }

    function forwardKeyboardEvent(event: KeyboardEvent, target: HTMLElement) {
        const anyEvent = event as any;
        const newEvent = new anyEvent.constructor(event.type, event);
        target.dispatchEvent(newEvent);

        event.preventDefault();
        event.stopPropagation();
    }

}
