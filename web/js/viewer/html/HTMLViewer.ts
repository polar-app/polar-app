import $ from '../../ui/JQuery';
import {Viewer} from '../Viewer';
import {Logger} from '../../logger/Logger';
import {notNull} from '../../Preconditions';
import {Model} from '../../Model';
import {PHZMetadata} from '../../phz/PHZMetadata';
import {DocDetails} from '../../metadata/DocDetails';

const {FrameResizer} = require("./FrameResizer");
const {FrameInitializer} = require("./FrameInitializer");
const {IFrameWatcher} = require("./IFrameWatcher");
const {HTMLFormat} = require("../../docformat/HTMLFormat");

const log = Logger.create();

export class HTMLViewer extends Viewer {

    private content: HTMLIFrameElement = document.createElement('iframe');

    private contentParent: HTMLElement = document.createElement('div');

    private textLayer: HTMLElement = document.createElement('div');

    private requestParams: RequestParams | null = null;

    private htmlFormat: any;

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    start() {

        super.start();

        console.log("Starting HTMLViewer");

        this.content = <HTMLIFrameElement>document.querySelector("#content");
        this.contentParent = <HTMLElement>document.querySelector("#content-parent");
        this.textLayer = <HTMLElement>document.querySelector(".textLayer");

        this.htmlFormat = new HTMLFormat();

        // *** start the resizer and initializer before setting the iframe

        $(document).ready(() => {

            this.requestParams = this._requestParams();

            this._captureBrowserZoom();

            this._loadRequestData();

            this._configurePageWidth();

            new IFrameWatcher(this.content, () => {

                console.log("Loading page now...");

                let frameResizer = new FrameResizer(this.contentParent, this.content);
                frameResizer.start();

                let frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

                this.startHandlingZoom();

            }).start();

        });

    }

    _captureBrowserZoom() {

        // TODO: for now this is used to just capture and disable zoom but
        // we should enable it in the future so we can handle zoom ourselves.

        $(document).keydown(function(event: KeyboardEvent) {

            if (event.ctrlKey && (event.which === 61 ||
                                  event.which === 107 ||
                                  event.which === 173 ||
                                  event.which === 109 ||
                                  event.which === 187 ||
                                  event.which === 189 ) ) {

                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();

            }
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/= key
        });

        $(window).bind('mousewheel DOMMouseScroll', function (event: MouseEvent) {

            if (event.ctrlKey) {

                console.log("Browser zoom detected. Preventing.");
                event.preventDefault();

            }

        });
    }

    startHandlingZoom() {

        let htmlViewer = this;

        $(".polar-zoom-select")
            .change(function() {
                $( "select option:selected" ).each(function() {
                    let zoom = $( this ).val();

                    htmlViewer.changeScale(parseFloat(zoom));

                });

                // make sure the select doesn't have focus so that we can scroll.
                console.log("Blurring the select to allow keyboard/mouse nav.");
                $(this).blur();

            })
    }

    /**
     * Get the page width from the descriptor if it's present and use that.
     *
     * Otherwise, use the defaults.
     */
    _configurePageWidth() {

        // the default width
        let width = 750;

        let descriptor = notNull(this.requestParams).descriptor;

        if(descriptor && descriptor.browser) {

            // use the screen width from the emulated device
            width = descriptor.browser.deviceEmulation.screenSize.width;

            log.info("Setting width from device emulation: " + width);

        }

        if( "scroll" in descriptor &&
            typeof descriptor.scroll.width === "number" &&
            descriptor.scroll.width > width ) {

            // we have a document that isn't mobile aware and hard coded to a
            // specific width greater than our default width.  This is a new
            // setting so we have to make sure the key is in the descriptor.

            width = descriptor.scroll.width;

            log.info("Setting width from scroll settings: " + width);

        }

        // page height size should be a function of 8.5x11

        let minHeight = (11/8.5) * width;

        console.log(`Configuring page with width=${width} and minHeight=${minHeight}`);

        document.querySelectorAll("#content-parent, .page, iframe").forEach(element => {
            (element as HTMLElement).style.width = `${width}px`;
        });

        document.querySelectorAll(".page, iframe").forEach((element) => {
            (element as HTMLElement).style.minHeight = `${minHeight}px`;
        });

    }

    changeScale(scale: number) {

        console.log("Changing scale to: " + scale);

        this._changeScaleMeta(scale);
        this._changeScale(scale);
        this._removeAnnotations();
        this._signalScale();

    }

    _changeScaleMeta(scale: number) {

        let metaElement = notNull(document.querySelector("meta[name='polar-scale']"));

        metaElement.setAttribute("content", `${scale}`);

    }

    _changeScale(scale: number) {

        // NOTE: removing the iframe and adding it back in fixed a major problem
        // with font fuzziness on Chrome/Electron.  Technically it should be
        // possible to resize the iframe via scale alone but I don't think
        // chrome re-renders the fonts unless significant scale changes are
        // made.

        let iframe = notNull(document.querySelector("iframe"));
        let iframeParentElement = iframe.parentElement;

        // TODO: we were experimenting with adding+removing the child iframes
        // but decided to back out the code as it was de-activating the iframes
        // and I couldn't click on them.

        //iframeParentElement.removeChild(iframe);

        let contentParent = notNull(document.querySelector("#content-parent"));
        (contentParent as HTMLElement).style.transform = `scale(${scale})`;

        //iframeParentElement.appendChild(iframe);

    }

    _removeAnnotations() {
        // remove all annotations from the .page. they will be re-created by
        // all the views. The PDF viewer does this for us automatically.

        document.querySelectorAll(".page .annotation").forEach(function(annotation) {
            (annotation.parentElement as HTMLElement).removeChild(annotation);
        });

    }

    // remove and re-inject an endOfContent element to trigger the view to
    // re-draw pagemarks.
    _signalScale() {

        console.log("HTMLViewer: Signaling rescale.");

        let pageElement = notNull(document.querySelector(".page"));
        let endOfContent = notNull(pageElement.querySelector(".endOfContent"));

        notNull(notNull(endOfContent).parentElement).removeChild(endOfContent);

        endOfContent = document.createElement("div");
        endOfContent.setAttribute("class", "endOfContent" );

        pageElement.appendChild(endOfContent);

    }

    /**
     * Get the request params as a dictionary.
     */
    _requestParams(): RequestParams {

        let url = new URL(window.location.href);

        return {
            file: notNull(url.searchParams.get("file")),
            descriptor: JSON.parse(notNull(url.searchParams.get("descriptor"))),
            fingerprint: notNull(url.searchParams.get("fingerprint"))
        }

    }


    _loadRequestData() {

        // *** now setup the iframe

        let params = this._requestParams();

        let file = params.file;

        if(!file) {
            file = "example1.html";
        }

        this.content.src = file;

        let fingerprint = params.fingerprint;
        if(!fingerprint) {
            throw new Error("Fingerprint is required");
        }

        this.htmlFormat.setCurrentDocFingerprint(fingerprint);

    }

    docDetails(): DocDetails {

        let requestParams = notNull(this.requestParams);

        return {
            url: requestParams.descriptor.url,
            title: requestParams.descriptor.title
        }

    }

}

interface RequestParams {
    file: string;
    descriptor: PHZMetadata;
    fingerprint: string;
}
