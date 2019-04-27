import {DocFormat, DocFormatName, PageDetail} from './DocFormat';
import {notNull} from '../Preconditions';
import {Optional} from '../util/ts/Optional';
import html2canvas from 'html2canvas';
import {URLs} from '../util/URLs';

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

        const polarFingerprint = this._queryFingerprintElement();

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

        // FIXME: we could build our OWN image and URL handler to ensure that
        // all the URLs that we're capturing are absolute URLs but we would have
        // to do this for ALL url types including those that are in CSS

        // FIXME: remove html2canvas as right now it just won't work for us.

        // FIXME: this isn't working as the images are broken.  Without a fix
        // for this we have to use the native screenshot mechanism in Electron

        if (HTMLFormat.canvas) {
            return HTMLFormat.canvas;
        }

        HTMLFormat.canvas = document.createElement('canvas');

        const createElement = (): HTMLElement => {
            const doc = this.targetDocument()!;
            console.log("FIXME: doc.location: " + doc.location.href);

            // FIXME: this
            // return <HTMLElement> doc.documentElement.cloneNode(true);

            return <HTMLElement> doc.documentElement!;
        };

        const element = createElement();

        console.log("FIXME666: going to use canvas with", element);

        const page = <HTMLElement> document.querySelector(".page");
        if (! page) {
            throw new Error("No page found");
        }

        const height = page.offsetHeight;
        const width = page.offsetWidth;

        const onClone = (clonedDoc: HTMLDocument) => {
            console.log("FIXME: got cloned doc: ", clonedDoc);

            const base = clonedDoc.documentElement.querySelector("base");

            if (! base) {
                throw new Error();
            }

            for (const img of Array.from(clonedDoc.querySelectorAll("img"))) {

                if (img.src) {

                    if (URLs.isURL(img.src)) {
                        continue;
                    }

                    const abs = URLs.absolute(base.href, img.src);
                    img.src = abs;

                    console.log("FIXME: expanded to: " + img.src);

                }

            }

        };

        // FIXME: the time of this is still long.. like 500ms to 1000ms and it's
        // very fragile ...

        // FIXME: play with enabling/disabling all the CSS overlays, capture, then
        // revert...

        // FIXME: now SVGs aren't rendering and if I enable
        // foreignObjectRendering what ends up happening is I get a black
        // screen.  Also I get a ton of 404s for image seven though theyu shoudl
        // be expanded.

        const opts = {
            allowTaint: true,
            onclone: onClone,
            // foreignObjectRendering: true
        };

        await html2canvas(element, {
            canvas: HTMLFormat.canvas,
            width, height,
            ...opts
        });

        return HTMLFormat.canvas;

    }

}
