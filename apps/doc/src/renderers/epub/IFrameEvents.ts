import {Logger} from 'polar-shared/src/logger/Logger';

/**
 * Moves events from the iframe, into the target element. This allows the event
 * listeners to see the event as if it was called inside the parent .page in the
 * parent DOM window.
 */
export namespace IFrameEvents {

    export function forwardEvents(iframe: HTMLIFrameElement, target: HTMLElement) {

        if (! iframe) {
            throw new Error("No iframe given");
        }

        if (! iframe.parentElement) {
            throw new Error("No parent for iframe");
        }

        if (! iframe.contentDocument) {
            throw new Error("No contentDocument for iframe");
        }

        iframe.contentDocument.body.addEventListener("keyup", event => forwardKeyboardEvent(event, target));
        iframe.contentDocument.body.addEventListener("keydown", event => forwardKeyboardEvent(event, target));
        iframe.contentDocument.body.addEventListener("keypress", event => forwardKeyboardEvent(event, target));

    }

    function forwardKeyboardEvent(event: KeyboardEvent, target: HTMLElement) {
        const anyEvent = event as any;
        const newEvent = new anyEvent.constructor(event.type, event);
        target.dispatchEvent(newEvent);

        event.preventDefault();
        event.stopPropagation();
    }

}
