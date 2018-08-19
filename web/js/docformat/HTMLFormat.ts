import {DocFormat} from './DocFormat';
import {notNull} from '../Preconditions';
import {Optional} from '../util/ts/Optional';

export class HTMLFormat extends DocFormat {

    public readonly name: string;

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

    setCurrentDocFingerprint(fingerprint: string) {
        let polarFingerprint = this._queryFingerprintElement();
        polarFingerprint.setAttribute("content", fingerprint);
    }

    _queryFingerprintElement(): HTMLElement {
        return notNull(document.querySelector("meta[name='polar-fingerprint']"));
    }

    /**
     * Get the current state of the doc.
     */
    currentState(event: any) {

        return {
            nrPages: 1,
            currentPageNumber: 1,
            pageElement: document.querySelector(".page")
        }

    }

    textHighlightOptions() {
        return {
        };
    }

    currentScale() {

        return Optional.of(document.querySelector("meta[name='polar-scale']"))
            .map(current => current.getAttribute('content'))
            .map(current => parseFloat(current))
            .get();

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
        return Optional.of(document.querySelector("iframe")).get().contentDocument;
    }

}
