"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DocFormat_1 = require("./DocFormat");
const Preconditions_1 = require("../Preconditions");
const Optional_1 = require("../util/ts/Optional");
class HTMLFormat extends DocFormat_1.DocFormat {
    constructor() {
        super();
        this.name = "html";
    }
    currentDocFingerprint() {
        let polarFingerprint = this._queryFingerprintElement();
        if (polarFingerprint !== null) {
            return polarFingerprint.getAttribute("content");
        }
        return null;
    }
    setCurrentDocFingerprint(fingerprint) {
        let polarFingerprint = this._queryFingerprintElement();
        polarFingerprint.setAttribute("content", fingerprint);
    }
    _queryFingerprintElement() {
        return Preconditions_1.notNull(document.querySelector("meta[name='polar-fingerprint']"));
    }
    currentState(event) {
        return {
            nrPages: 1,
            currentPageNumber: 1,
            pageElement: document.querySelector(".page")
        };
    }
    textHighlightOptions() {
        return {};
    }
    currentScale() {
        return Optional_1.Optional.of(document.querySelector("meta[name='polar-scale']"))
            .map(current => current.getAttribute('content'))
            .map(current => parseFloat(current))
            .get();
    }
    targetDocument() {
        return Optional_1.Optional.of(document.querySelector("iframe")).get().contentDocument;
    }
}
exports.HTMLFormat = HTMLFormat;
//# sourceMappingURL=HTMLFormat.js.map