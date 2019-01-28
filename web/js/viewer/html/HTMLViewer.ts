import $ from '../../ui/JQuery';
import {Viewer} from '../Viewer';
import {Logger} from '../../logger/Logger';
import {notNull} from '../../Preconditions';
import {Model} from '../../model/Model';
import {PHZMetadata} from '../../phz/PHZMetadata';
import {DocDetail} from '../../metadata/DocDetail';
import {LinkHandler} from './LinkHandler';
import {Services} from '../../util/services/Services';
import {HTMLFormat} from '../../docformat/HTMLFormat';
import {FrameInitializer} from './FrameInitializer';
import {BackgroundFrameResizer} from './BackgroundFrameResizer';
import {Descriptors} from './Descriptors';
import {IFrameWatcher} from './IFrameWatcher';
import {FrameResizer} from './FrameResizer';
import {RendererAnalytics} from '../../ga/RendererAnalytics';

const log = Logger.create();

const ENABLE_VIDEO = true;

export class HTMLViewer extends Viewer {

    private content: HTMLIFrameElement = document.createElement('iframe');

    private contentParent: HTMLElement = document.createElement('div');

    private textLayer: HTMLElement = document.createElement('div');

    private requestParams: RequestParams | null = null;

    private htmlFormat: any;

    private frameResizer?: FrameResizer;

    private readonly model: Model;

    constructor(model: Model) {
        super();
        this.model = model;
    }

    public start() {

        log.info("Starting HTMLViewer");

        this.content = <HTMLIFrameElement> document.querySelector("#content");
        this.contentParent = <HTMLElement> document.querySelector("#content-parent");
        this.textLayer = <HTMLElement> document.querySelector(".textLayer");

        this.htmlFormat = new HTMLFormat();

        RendererAnalytics.pageview("/htmlviewer");

        // *** start the resizer and initializer before setting the iframe

        $(document).ready(async () => {

            this.requestParams = this._requestParams();

            this._captureBrowserZoom();

            this._loadRequestData();

            this._configurePageWidth();

            this.frameResizer = new FrameResizer(this.contentParent, this.content);

            new IFrameWatcher(this.content, () => {

                log.info("Loading page now...");

                const backgroundFrameResizer = new BackgroundFrameResizer(this.contentParent, this.content);
                backgroundFrameResizer.start();

                const frameInitializer = new FrameInitializer(this.content, this.textLayer);
                frameInitializer.start();

                this.startHandlingZoom();

            }).start();

            window.addEventListener("resize", () => {
                this.doZoom();
                this.frameResizer!.resize(true)
                    .catch(err => log.error("Unable to resize: ", err));

            });

            await Services.start(new LinkHandler(this.content));

        });

    }

    private _captureBrowserZoom() {

        // TODO: for now this is used to just capture and disable zoom but
        // we should enable it in the future so we can handle zoom ourselves.

        $(document).keydown(function(event: KeyboardEvent) {

            if (event.ctrlKey && (event.which === 61 ||
                                  event.which === 107 ||
                                  event.which === 173 ||
                                  event.which === 109 ||
                                  event.which === 187 ||
                                  event.which === 189 ) ) {

                log.info("Browser zoom detected. Preventing.");
                event.preventDefault();

            }
            // 107 Num Key  +
            // 109 Num Key  -
            // 173 Min Key  hyphen/underscor Hey
            // 61 Plus key  +/= key
        });

        $(window).bind('mousewheel DOMMouseScroll', function(event: MouseEvent) {

            if (event.ctrlKey) {

                log.info("Browser zoom detected. Preventing.");
                event.preventDefault();

            }

        });
    }

    private startHandlingZoom() {

        $(".polar-zoom-select")
            .change(() => {
                this.doZoom();
            });
    }

    /**
     * Get the page width from the descriptor if it's present and use that.
     *
     * Otherwise, use the defaults.
     */
    private _configurePageWidth() {

        const descriptor = notNull(this.requestParams).descriptor;

        log.info("Loading with descriptor: ", descriptor);

        const docDimensions = Descriptors.calculateDocDimensions(descriptor);

        log.info(`Configuring page with width=${docDimensions.width} and minHeight=${docDimensions.minHeight}`);

        document.querySelectorAll("#content-parent, .page, iframe").forEach(element => {
            (element as HTMLElement).style.width = `${docDimensions.width}px`;
        });

        document.querySelectorAll(".page, iframe").forEach((element) => {

            const htmlElement = element as HTMLElement;
            const minHeightElement = htmlElement.parentElement!;

            minHeightElement.style.minHeight = `${docDimensions.minHeight}px`;

        });

    }

    public doZoom() {

        const selectElement: HTMLSelectElement | null
            = document.querySelector(".polar-zoom-select");

        if (selectElement === null) {
            console.log("No select");
            return;
        }

        const zoom = selectElement.options[selectElement.selectedIndex].value;

        this.changeScale(parseFloat(zoom));

        // make sure the select doesn't have focus so that we can scroll.
        selectElement.blur();

    }

    public changeScale(scale: number) {

        log.info("Changing scale to: " + scale);

        this._changeScaleMeta(scale);
        this._changeScale(scale);
        this._removeAnnotations();
        this._signalScale();

    }

    private _changeScaleMeta(scale: number) {

        const metaElement = notNull(document.querySelector("meta[name='polar-scale']"));

        metaElement.setAttribute("content", `${scale}`);

    }

    private _changeScale(scale: number) {

        // NOTE: removing the iframe and adding it back in fixed a major problem
        // with font fuzziness on Chrome/Electron.  Technically it should be
        // possible to resize the iframe via scale alone but I don't think
        // chrome re-renders the fonts unless significant scale changes are
        // made.

        // const iframe = notNull(document.querySelector("iframe"));
        // const iframeParentElement = iframe.parentElement;

        // TODO: we were experimenting with adding+removing the child iframes
        // but decided to back out the code as it was de-activating the iframes
        // and I couldn't click on them.

        // iframeParentElement.removeChild(iframe);

        // FIXME: run an algorithm to maek sure there are no elements between two
        // paths in the DOM that have any scrollHeight > their height.

        const contentParent = notNull(document.querySelector("#content-parent"));
        (contentParent as HTMLElement).style.transform = `scale(${scale})`;

        const height = parseInt(this.content.getAttribute('data-original-height')!);
        const newHeight = height * scale;

        this.frameResizer!.resize(true, newHeight);

    }

    private _removeAnnotations() {
        // remove all annotations from the .page. they will be re-created by
        // all the views. The PDF viewer does this for us automatically.

        document.querySelectorAll(".page .annotation").forEach(function(annotation) {
            (annotation.parentElement as HTMLElement).removeChild(annotation);
        });

    }

    // remove and re-inject an endOfContent element to trigger the view to
    // re-draw pagemarks.
    private _signalScale() {

        log.info("HTMLViewer: Signaling rescale.");

        const pageElement = notNull(document.querySelector(".page"));
        let endOfContent = notNull(pageElement.querySelector(".endOfContent"));

        notNull(notNull(endOfContent).parentElement).removeChild(endOfContent);

        endOfContent = document.createElement("div");
        endOfContent.setAttribute("class", "endOfContent" );

        pageElement.appendChild(endOfContent);

    }

    /**
     * Get the request params as a dictionary.
     */
    private _requestParams(): RequestParams {

        const url = new URL(window.location.href);

        return {
            file: notNull(url.searchParams.get("file")),
            descriptor: JSON.parse(notNull(url.searchParams.get("descriptor"))),
            fingerprint: notNull(url.searchParams.get("fingerprint"))
        };

    }


    private _loadRequestData() {

        // *** now setup the iframe

        const params = this._requestParams();

        let file = params.file;

        if (!file) {
            file = "example1.html";
        }

        // TODO: improve this so that we can detect if this is a Youtube video
        // embed safely.
        if (ENABLE_VIDEO && file.indexOf("youtube.com/") !== -1) {
            // TODO: better regex for this in the future.

            const embedHTML = HTMLViewer.createYoutubeEmbed(file, this.content);

            this.content.contentDocument!.body.innerHTML = embedHTML;

            this.content.contentWindow!.history.pushState({"html": embedHTML, "pageTitle": 'Youtube Embed'}, "", file);

        } else {
            this.content.src = file;
        }

        const fingerprint = params.fingerprint;
        if (!fingerprint) {
            throw new Error("Fingerprint is required");
        }

        this.htmlFormat.setCurrentDocFingerprint(fingerprint);

    }

    private static createYoutubeEmbed(url: string, content: HTMLIFrameElement) {

        const DEFAULT_WIDTH = 560;
        const DEFAULT_HEIGHT = 315;

        const width = content.contentDocument!.body.offsetWidth;
        const height = (DEFAULT_HEIGHT / DEFAULT_WIDTH) * width;

        // get the video ID from a URL like:
        //
        // https://www.youtube.com/watch?v=CP1BVpF-NjY

        const u = new URL(url);
        const video_id = u.searchParams.get('v');

        return `<iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${video_id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    }

    public docDetail(): DocDetail {

        const requestParams = notNull(this.requestParams);

        return {
            fingerprint: requestParams.fingerprint,
            title: requestParams.descriptor.title,
            url: requestParams.descriptor.url,
            nrPages: 1,
            filename: this.getFilename()
        };

    }

}

interface RequestParams {
    file: string;
    descriptor: PHZMetadata;
    fingerprint: string;
}
