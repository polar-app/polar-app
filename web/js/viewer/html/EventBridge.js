"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../logger/Logger");
const FrameEvents_1 = require("./FrameEvents");
const log = Logger_1.Logger.create();
class EventBridge {
    constructor(targetElement, iframe) {
        this.targetElement = targetElement;
        this.iframe = iframe;
    }
    start() {
        if (!this.iframe.parentElement) {
            throw new Error("No parent for iframe");
        }
        if (!this.iframe.contentDocument) {
            throw new Error("No contentDocument for iframe");
        }
        this.iframe.addEventListener("load", () => this.addListeners(this.iframe));
        this.iframe.parentElement.addEventListener('DOMNodeInserted', (event) => this.elementInsertedListener(event), false);
        log.info("Event bridge started on: ", this.iframe.contentDocument.location.href);
    }
    elementInsertedListener(event) {
        log.info("elementInsertedListener event: ", event);
        if (event && event.target && event.target.tagName === "IFRAME") {
            log.info("Main iframe re-added.  Registering event listeners again");
            let iframe = event.target;
            this.addListeners(iframe);
        }
    }
    addListeners(iframe) {
        if (!iframe.contentDocument) {
            return;
        }
        iframe.contentDocument.body.addEventListener("keyup", this.keyListener.bind(this));
        iframe.contentDocument.body.addEventListener("keydown", this.keyListener.bind(this));
        iframe.contentDocument.body.addEventListener("mouseup", this.mouseListener.bind(this));
        iframe.contentDocument.body.addEventListener("mousedown", this.mouseListener.bind(this));
        iframe.contentDocument.body.addEventListener("contextmenu", this.mouseListener.bind(this));
        iframe.contentDocument.body.addEventListener("click", event => {
            let anchor = this.getAnchor(event.target);
            if (anchor) {
                log.info("Link click prevented.");
                event.preventDefault();
                let href = anchor.href;
                if (href && (href.startsWith("http:") || href.startsWith("https:"))) {
                    document.location.href = href;
                }
            }
            else {
                this.mouseListener(event);
            }
        });
    }
    getAnchor(target) {
        if (target === null || target === undefined) {
            return undefined;
        }
        if (target instanceof HTMLElement) {
            let element = target;
            if (target.tagName === "A") {
                return element;
            }
            return this.getAnchor(element.parentElement);
        }
        else {
            return undefined;
        }
    }
    mouseListener(event) {
        let eventPoints = FrameEvents_1.FrameEvents.calculatePoints(this.iframe, event);
        let newEvent = new event.constructor(event.type, event);
        Object.defineProperty(newEvent, "pageX", { value: eventPoints.page.x });
        Object.defineProperty(newEvent, "pageY", { value: eventPoints.page.y });
        Object.defineProperty(newEvent, "clientX", { value: eventPoints.client.x });
        Object.defineProperty(newEvent, "clientY", { value: eventPoints.client.y });
        Object.defineProperty(newEvent, "offsetX", { value: eventPoints.offset.x });
        Object.defineProperty(newEvent, "offsetY", { value: eventPoints.offset.y });
        if (newEvent.pageX !== eventPoints.page.x) {
            throw new Error("Define of properties failed");
        }
        this.targetElement.dispatchEvent(newEvent);
    }
    keyListener(event) {
        let newEvent = new event.constructor(event.type, event);
        this.targetElement.dispatchEvent(newEvent);
    }
}
exports.EventBridge = EventBridge;
//# sourceMappingURL=EventBridge.js.map