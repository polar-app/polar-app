const $ = require('jquery')
const {DocFormat} = require("./DocFormat");

class HTMLFormat extends DocFormat {

    constructor() {
        super();
        this.name = "html";
    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
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
        return document.querySelector("meta[name='polar-fingerprint']");
    }

    /**
     * Get the current state of the doc.
     */
    currentState(event) {

        return {
            nrPages: 1,
            currentPageNumber: 1,
            pageElement: document.querySelector(".page")
        }

    }

    /**
     * Pagemark options for this viewer.
     *
     * @return {{}}
     */
    pagemarkOptions() {
        return {
        };
    }

    textHighlightOptions() {
        return {
        };
    }

    currentScale() {

        let scale = parseFloat(document.querySelector("meta[name='polar-scale']").getAttribute("content"));
        console.log("FIXME: scale: " + scale);

        return scale;

        /*
        let select = document.querySelector("select");
        let value = select.options[select.selectedIndex].value;

        if(!value) {
            throw new Error("No scale value");
        }

        let result = parseInt(value);

        if(isNaN(result)) {
            throw new Error("Not a number from: " + value);
        }

        if(result <= 0) {
            throw new Error("Scale is too small: " + result);
        }

        return result;
        */

    }

    targetDocument() {
        return document.querySelector("iframe").contentDocument;
    }

}

module.exports.HTMLFormat = HTMLFormat;
