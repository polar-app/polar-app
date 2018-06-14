const {DocFormat} = require("./DocFormat");

class HTMLFormat extends DocFormat {

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    currentDocFingerprint() {

        console.log("FIXME1: ");

        let polarFingerprint = document.querySelector("meta[name='polar-fingerprint']");


        console.log("FIXME2: ", polarFingerprint);

        if (polarFingerprint !== null) {
            console.log("FIXME2: ", polarFingerprint);
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

}

module.exports.HTMLFormat = HTMLFormat;
