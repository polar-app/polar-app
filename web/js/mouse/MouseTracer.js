"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseTracer = void 0;
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
                MouseTracer.startWithinIFrame(iframe);
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
        doc.addEventListener("mousemove", mouseEvent => {
            const tracerElement = MouseTracer.getOrCreateTracerElement(doc);
            tracerElement.textContent = MouseTracer.format(mouseEvent);
        });
        doc.addEventListener("mouseout", mouseEvent => {
            const tracerElement = MouseTracer.getOrCreateTracerElement(doc);
            const last = tracerElement.textContent;
            tracerElement.textContent = `OUT: ${last}`;
        });
        doc.addEventListener("click", mouseEvent => {
            console.log(`Got mouseEvent at ${doc.location.href}: `, mouseEvent);
        });
    }
    static format(mouseEvent) {
        return `screen: ${mouseEvent.screenX}, ${mouseEvent.screenY} client: ${mouseEvent.clientX}, ${mouseEvent.clientY} page: ${mouseEvent.pageX}, ${mouseEvent.pageY}`;
    }
    static getOrCreateTracerElement(doc) {
        const id = "tracer-element";
        if (doc.getElementById(id)) {
            return doc.getElementById(id);
        }
        const div = doc.createElement("div");
        div.style.cssText = "position: fixed; top: 0px; right: 0px; padding: 5px; background-color: #c6c6c6; z-index: 999999; font-size: 12px; min-width: 18em; min-height: 1em;";
        div.textContent = ' ';
        div.setAttribute("id", id);
        doc.body.appendChild(div);
        return div;
    }
}
exports.MouseTracer = MouseTracer;
//# sourceMappingURL=MouseTracer.js.map