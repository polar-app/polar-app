"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFrameEventForwarder = void 0;
var IFrameEventForwarder;
(function (IFrameEventForwarder) {
    function start(iframe, target) {
        if (!iframe) {
            throw new Error("No iframe given");
        }
        if (!iframe.parentElement) {
            throw new Error("No parent for iframe");
        }
        if (!iframe.contentDocument) {
            throw new Error("No contentDocument for iframe");
        }
        iframe.contentDocument.body.addEventListener("keyup", event => handleKeyboardEvent(event, target));
        iframe.contentDocument.body.addEventListener("keydown", event => handleKeyboardEvent(event, target));
        iframe.contentDocument.body.addEventListener("keypress", event => handleKeyboardEvent(event, target));
    }
    IFrameEventForwarder.start = start;
    let EventForwardType;
    (function (EventForwardType) {
        EventForwardType[EventForwardType["FORWARD"] = 0] = "FORWARD";
        EventForwardType[EventForwardType["DEFAULT"] = 1] = "DEFAULT";
    })(EventForwardType || (EventForwardType = {}));
    function computeType(event) {
        function isCopy() {
            return ['c', 'x', 'v'].includes(event.key) && (event.metaKey || event.ctrlKey);
        }
        if (isCopy()) {
            return EventForwardType.DEFAULT;
        }
        return EventForwardType.FORWARD;
    }
    function handleKeyboardEvent(event, target) {
        const type = computeType(event);
        if (type === EventForwardType.FORWARD) {
            forwardKeyboardEvent(event, target);
        }
    }
    function forwardKeyboardEvent(event, target) {
        const anyEvent = event;
        const newEvent = new anyEvent.constructor(event.type, event);
        target.dispatchEvent(newEvent);
        event.preventDefault();
        event.stopPropagation();
    }
})(IFrameEventForwarder = exports.IFrameEventForwarder || (exports.IFrameEventForwarder = {}));
//# sourceMappingURL=IFrameEventForwarder.js.map