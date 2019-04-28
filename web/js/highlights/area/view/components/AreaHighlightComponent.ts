import {Logger} from "../../../../logger/Logger";

import {DocFormatFactory} from "../../../../docformat/DocFormatFactory";
import {Component} from "../../../../components/Component";
import {forDict} from "../../../../util/Functions";
import {Dimensions} from "../../../../util/Dimensions";
import {AreaHighlight} from "../../../../metadata/AreaHighlight";
import {AnnotationRects} from "../../../../metadata/AnnotationRects";
import {AreaHighlightRect} from "../../../../metadata/AreaHighlightRect";
import {AreaHighlightRects} from "../../../../metadata/AreaHighlightRects";
import {BoxController} from "../../../../boxes/controller/BoxController";
import {BoxOptions} from "../../../../boxes/controller/BoxOptions";
import {DocFormat} from "../../../../docformat/DocFormat";
import {AnnotationEvent} from '../../../../annotations/components/AnnotationEvent';
import {BoxMoveEvent} from '../../../../boxes/controller/BoxMoveEvent';
import {ILTRect} from '../../../../util/rects/ILTRect';
import {Canvases} from '../../../../util/Canvases';
import {ExtractedImage} from '../../../../util/Canvases';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {AsyncSerializer} from '../../../../util/AsyncSerializer';
import {AreaHighlights} from '../../../../metadata/AreaHighlights';
import {CapturedScreenshots} from '../../../../screenshots/CapturedScreenshots';
import {CaptureTarget} from '../../../../screenshots/CapturedScreenshots';
import {Buffers} from '../../../../util/Buffers';

const log = Logger.create();

export class AreaHighlightComponent extends Component {

    private readonly docFormat: DocFormat;

    private annotationEvent?: AnnotationEvent;
    private areaHighlight?: AreaHighlight;
    private boxController?: BoxController;

    private asyncSerializer = new AsyncSerializer();

    constructor(private persistenceLayerProvider: PersistenceLayerProvider) {
        super();
        this.docFormat = DocFormatFactory.getInstance();
    }

    /**
     * @Override
     */
    public init(annotationEvent: AnnotationEvent) {

        // TODO: we should a specific event class for this data which is
        // captured within a higher level annotationEvent.
        this.annotationEvent = annotationEvent;
        this.areaHighlight = annotationEvent.value;

        // FIXME: need to create the FIRST screenshot when this is created.

        this.boxController = new BoxController(boxMoveEvent => this.onBoxMoved(boxMoveEvent));

    }

    /**
     *
     */
    private onBoxMoved(boxMoveEvent: BoxMoveEvent) {

        // TODO: actually I think this belongs in the controller... not the view

        // TODO: refactor / this code is shared with the
        // AbstractPagemarkComponent

        // console.log("Box moved to: ", boxMoveEvent);

        // TODO: should I PLAY with capture directly within the current tab?

        const annotationRect = AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect,
                                                                        boxMoveEvent.restrictionRect);

        const areaHighlightRect = new AreaHighlightRect(annotationRect);

        if (boxMoveEvent.state === "completed") {

            const annotationEvent = this.annotationEvent!;

            const { docMeta, pageMeta } = annotationEvent;

            const existingAreaHighlight = pageMeta.areaHighlights[this.areaHighlight!.id];

            const doWrite = async () => {

                // FIXME: in PDF move capture via canvas but in HTML mode
                // capture via screenshot.  PDF means we can capture on the web
                // too.

                // this await is unfortunately but it's almost instant
                // const extractedImage = await this.captureScreenshot(boxMoveEvent.boxRect);
                const extractedImage = await this.captureScreenshot2(boxMoveEvent.boxRect, boxMoveEvent.target);

                console.log("FIXME: wroting with annotationRect: ", annotationRect);
                console.log("FIXME: wroting with boxRect: ", boxMoveEvent.boxRect);
                console.log("FIXME: wroting with rect: ", areaHighlightRect);

                const writeOpts = {
                    datastore: this.persistenceLayerProvider(),
                    docMeta,
                    pageMeta,
                    areaHighlight: existingAreaHighlight,
                    rect: areaHighlightRect,
                    extractedImage
                };

                const writer = AreaHighlights.write(writeOpts);

                const [writtenAreaHighlight, committer] = writer.prepare();

                this.areaHighlight = writtenAreaHighlight;

                await committer.commit();

            };

            this.asyncSerializer.execute(async () => await doWrite())
                .catch(err => log.error("Unable to write to datastore: ", err));

        } else {
            // noop
        }

    }

    /**
     * FIXME: this is relative to the viewport NOT the rect... but I could call
     * get boundingClientRect on it ....
     *
     *
     */
    private async captureScreenshot2(rect: ILTRect, element: HTMLElement): Promise<ExtractedImage> {

        // FIXME we should try to find the webContents ID of the iframe...
        // NOT the root window as this will work a LOT better and then we can
        // use rect directly (not the element).  By better I mean we will not
        // have any of the image overlays.

        const {width, height} = rect;

        const boundingClientRect = element.getBoundingClientRect();

        // const target: CaptureTarget = {
        //     x: rect.left,
        //     y: rect.top,
        //     width, height
        // };

        const target: CaptureTarget = {
            x: boundingClientRect.left,
            y: boundingClientRect.top,
            width, height
        };

        const before = Date.now();
        const captured = await CapturedScreenshots.capture(target, {type: 'png'});
        const duration = Date.now() - before;
        console.log("FIXME: CapturedScreenshots.capture duration: ", duration);

        const buffer = <Buffer> captured.data;
        const data = Buffers.toArrayBuffer(buffer);

        return {data, type: 'image/png', width, height};

    }


    private async captureScreenshot(rect: ILTRect): Promise<ExtractedImage> {

        const {pageMeta} = this.annotationEvent!;
        const pageNum = pageMeta.pageInfo.num;

        const canvas = await this.docFormat.getCanvas(pageNum);

        return await Canvases.extract(canvas, rect);

    }

    /**
     * @Override
     */
    public render() {

        this.destroy();

        const annotationEvent = this.annotationEvent!;
        const areaHighlight = this.areaHighlight!;
        const boxController = this.boxController!;

        log.debug("render()");

        const docMeta = annotationEvent.docMeta;
        const pageMeta = annotationEvent.pageMeta;
        const docInfo = docMeta.docInfo;

        const pageElement = this.docFormat.getPageElementFromPageNum(pageMeta.pageInfo.num);
        const dimensionsElement = pageElement.querySelector(".canvasWrapper, .iframeWrapper")!;

        // the container must ALWAYS be the pageElement because if we use any
        // other container PDF.js breaks.
        const containerElement = pageElement;

        const pageDimensions = new Dimensions({
            width: dimensionsElement.clientWidth,
            height: dimensionsElement.clientHeight
        });

        forDict(areaHighlight.rects, (key, rect) => {

            const areaHighlightRect = AreaHighlightRects.createFromRect(rect);
            const overlayRect = areaHighlightRect.toDimensions(pageDimensions);

            log.debug("Rendering annotation at: " + JSON.stringify(overlayRect, null, "  "));

            const id = this.createID();

            let highlightElement = document.getElementById(id);

            if (highlightElement === null ) {

                // only create the pagemark if it's missing.
                highlightElement = document.createElement("div");
                highlightElement.setAttribute("id", id);

                containerElement.insertBefore(highlightElement, containerElement.firstChild);

                log.debug("Creating box controller for highlightElement: ", highlightElement);

                boxController.register(new BoxOptions({
                    target: highlightElement,
                    restrictionElement: dimensionsElement,
                    intersectedElementsSelector: ".area-highlight"
                }));

            }

            // TODO: a lot of this code is shared with pagemarks.

            highlightElement.setAttribute("data-type", "area-highlight");
            highlightElement.setAttribute("data-doc-fingerprint", docInfo.fingerprint);
            highlightElement.setAttribute("data-area-highlight-id", areaHighlight.id);
            highlightElement.setAttribute("data-annotation-id", areaHighlight.id);
            highlightElement.setAttribute("data-page-num", `${pageMeta.pageInfo.num}`);

            // annotation descriptor metadata.
            highlightElement.setAttribute("data-annotation-type", "area-highlight");
            highlightElement.setAttribute("data-annotation-id", areaHighlight.id);
            highlightElement.setAttribute("data-annotation-page-num", `${pageMeta.pageInfo.num}`);
            highlightElement.setAttribute("data-annotation-doc-fingerprint", docInfo.fingerprint);

            highlightElement.className = `area-highlight annotation area-highlight-${areaHighlight.id}`;

            highlightElement.style.position = "absolute";
            highlightElement.style.backgroundColor = `yellow`;
            highlightElement.style.opacity = `0.5`;
            (highlightElement.style as any).mixBlendMode = 'multiply';
            highlightElement.style.border = `1px solid #c6c6c6`;

            // if(this.docFormat.name === "pdf") {
            //     // this is only needed for PDF and we might be able to use a
            // transform // in the future which would be easier. let
            // currentScale = this.docFormat.currentScale(); overlayRect =
            // Rects.scale(overlayRect, currentScale); }

            highlightElement.style.left = `${overlayRect.left}px`;
            highlightElement.style.top = `${overlayRect.top}px`;

            highlightElement.style.width = `${overlayRect.width}px`;
            highlightElement.style.height = `${overlayRect.height}px`;

            highlightElement.style.zIndex = '1';


        });

    }

    /**
     * Create a unique DOM ID for this pagemark.
     */
    private createID() {
        return `area-highlight-${this.areaHighlight!.id}`;
    }

    /**
     * @Override
     */
    public destroy() {

        const selector = `.area-highlight-${this.areaHighlight!.id}`;
        const elements = document.querySelectorAll(selector);

        log.debug(`Found N elements for selector ${selector}: ` + elements.length);

        elements.forEach(highlightElement => {
            highlightElement.parentElement!.removeChild(highlightElement);
        });

    }

}
