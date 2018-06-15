const $ = require('jquery')
const {DocFormat} = require("./DocFormat");

class HTMLFormat extends DocFormat {

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    currentDocFingerprint() {

        let polarFingerprint = document.querySelector("meta[name='polar-fingerprint']");

        if (polarFingerprint !== null) {
            return polarFingerprint.getAttribute("content");
        }

        return null;

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
            // I have NO idea why we require 1... CSS zIndex is insane!
            zIndex: 1,
            requiresTransformForScale: true
        };
    }

    currentScale() {

        let select = document.querySelector("select");
        return select.options[select.selectedIndex].value;

    }

}

module.exports.HTMLFormat = HTMLFormat;
