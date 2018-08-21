"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Optional_1 = require("../../util/ts/Optional");
const Styles_1 = require("../../util/Styles");
const MAX_RESIZES = 25;
class FrameResizer {
    constructor(parent, iframe) {
        this.timeoutInterval = 250;
        this.resizes = 0;
        if (!parent) {
            throw new Error("No parent");
        }
        if (!iframe) {
            throw new Error("No iframe");
        }
        this.parent = parent;
        this.iframe = iframe;
        this.height = undefined;
    }
    start() {
        this.resizeParentInBackground();
    }
    resizeParentInBackground() {
        if (this.resizes > MAX_RESIZES) {
            console.log("Hit MAX_RESIZES: " + MAX_RESIZES);
            this.doResize(true);
            return;
        }
        else {
            this.doResize(false);
        }
        setTimeout(this.resizeParentInBackground.bind(this), this.timeoutInterval);
    }
    doResize(final) {
        ++this.resizes;
        let contentDocument = this.iframe.contentDocument;
        if (!contentDocument)
            return;
        if (!contentDocument.body)
            return;
        let height = Styles_1.Styles.parsePX(Optional_1.Optional.of(this.iframe.style.height)
            .filter((current) => current !== null)
            .filter(current => current !== "")
            .getOrElse("0px"));
        let newHeight = contentDocument.body.scrollHeight;
        let delta = Math.abs(newHeight - height);
        let deltaPerc = 100 * (delta / height);
        if (!final && deltaPerc < 5) {
            return;
        }
        if (height !== newHeight) {
            this.iframe.style.height = `${newHeight}px`;
            this.height = newHeight;
        }
    }
}
exports.FrameResizer = FrameResizer;
//# sourceMappingURL=FrameResizer.js.map