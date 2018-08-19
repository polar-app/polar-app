"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MouseTracer {
    constructor(doc) {
        this.doc = doc;
    }
    start() {
        MouseTracer.startWithinDoc(this.doc);
        this.doc.querySelectorAll("iframe").forEach(iframe => {
            if (!MouseTracer.startWithinIFrame(iframe)) {
                iframe.addEventListener("load", () => {
                    MouseTracer.startWithinIFrame(iframe);
                });
            }
        });
    }
    static startWithinIFrame(iframe) {
        if (iframe.contentDocument) {
            MouseTracer.startWithinDoc(iframe.contentDocument);
            return true;
        }
        return false;
    }
    static startWithinDoc(doc) {
        let tracerElement = MouseTracer.createTracerElement(doc);
        doc.body.appendChild(tracerElement);
        doc.addEventListener("mousemove", mouseEvent => {
            tracerElement.textContent = MouseTracer.format(mouseEvent);
        });
        doc.addEventListener("mouseout", mouseEvent => {
            let last = tracerElement.textContent;
            tracerElement.textContent = `OUT (last was: ${last})`;
        });
        doc.addEventListener("click", mouseEvent => {
            console.log(`Got mouseEvent at ${doc.location.href}: `, mouseEvent);
        });
    }
    static format(mouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }
    static createTracerElement(doc) {
        let div = doc.createElement("div");
        div.style.cssText = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 999999; font-size: 12px; min-width: 18em; min-height: 1em;";
        div.textContent = ' ';
        return div;
    }
}
exports.MouseTracer = MouseTracer;
//# sourceMappingURL=MouseTracer.js.map