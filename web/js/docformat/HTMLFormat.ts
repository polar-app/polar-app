import {DocFormat, DocFormatName, PageDetail} from './DocFormat';
import {notNull} from '../Preconditions';
import {Optional} from '../util/ts/Optional';
import html2canvas from 'html2canvas';

export class HTMLFormat extends DocFormat {

    public readonly name = 'html';

    private static canvas: HTMLCanvasElement | undefined;

    constructor() {
        super();
    }

    /**
     * Get all the metadata about the current page.
     */
    public getCurrentPageDetail(): PageDetail {

        const pageElement = notNull(this.getCurrentPageElement());
        const pageNum = this.getPageNumFromPageElement(pageElement);

        const dimensions = {
            width: pageElement.offsetWidth,
            height: pageElement.offsetHeight
        };

        return { pageElement, pageNum, dimensions };

    }

    /**
     * Get the current doc fingerprint or null if it hasn't been loaded yet.
     */
    public currentDocFingerprint(): string | undefined {

        let polarFingerprint = this._queryFingerprintElement();

        if (polarFingerprint !== null) {
            return Optional.of(polarFingerprint.getAttribute("content")!).getOrUndefined();
        }

        return undefined;

    }

    setCurrentDocFingerprint(fingerprint: string) {
        let polarFingerprint = this._queryFingerprintElement();
        polarFingerprint.setAttribute("content", fingerprint);
    }

    private _queryFingerprintElement(): Element {
        return notNull(document.querySelector("meta[name='polar-fingerprint']"));
    }

    /**
     * Get the current state of the doc.
     */
    public currentState() {

        return {
            nrPages: 1,
            currentPageNumber: 1,
        };

    }

    textHighlightOptions() {
        return {
        };
    }

    public currentScale() {

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

    public targetDocument(): HTMLDocument | null {
        return Optional.of(document.querySelector("iframe")).get().contentDocument;
    }

    public async getCanvas(pageNum: number): Promise<HTMLCanvasElement> {

        // FIXME: remove html2canvas as right now it just won't work for us.

        // FIXME: this isn't working as the images are broken.  Without a fix
        // for this we have to use the native screenshot mechanism in Electron

        if (HTMLFormat.canvas) {
            return HTMLFormat.canvas;
        }

        HTMLFormat.canvas = document.createElement('canvas');

        const doc = this.targetDocument()!;

        console.log("FIXME: doc.location: " + doc.location.href);

        const page = <HTMLElement> document.querySelector(".page");
        if (! page) {
            throw new Error("No page found");
        }

        const height = page.offsetHeight;
        const width = page.offsetWidth;

        const opts = {
            allowTaint: true,
            foreignObjectRendering: true
        };

        await html2canvas(doc.documentElement, {
            canvas: HTMLFormat.canvas,
            width, height,
            ...opts
        });

        return HTMLFormat.canvas;

    }

}
