import {Logger} from "../../../../logger/Logger";

import {DocFormatFactory} from "../../../../docformat/DocFormatFactory";
import {Component} from "../../../../components/Component";
import {forDict} from "../../../../util/Functions";
import {Dimensions} from "../../../../util/Dimensions";
import {AreaHighlight} from "../../../../metadata/AreaHighlight";
import {Position} from "../../../../metadata/BaseHighlight";
import {AnnotationRects} from "../../../../metadata/AnnotationRects";
import {AreaHighlightRect} from "../../../../metadata/AreaHighlightRect";
import {AreaHighlightRects} from "../../../../metadata/AreaHighlightRects";
import {BoxController} from "../../../../boxes/controller/BoxController";
import {BoxOptions} from "../../../../boxes/controller/BoxOptions";
import {DocFormat} from "../../../../docformat/DocFormat";
import {AnnotationEvent} from '../../../../annotations/components/AnnotationEvent';
import {BoxMoveEvent} from '../../../../boxes/controller/BoxMoveEvent';
import {PersistenceLayerProvider} from '../../../../datastore/PersistenceLayer';
import {AsyncSerializer} from '../../../../util/AsyncSerializer';
import {AreaHighlights} from '../../../../metadata/AreaHighlights';
import {AreaHighlightWriteOpts} from '../../../../metadata/AreaHighlights';
import {Screenshots} from '../../../../screenshots/Screenshots';
import {Arrays} from '../../../../util/Arrays';
import {DoWriteOpts} from '../../../../metadata/AreaHighlights';

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

        this.boxController = new BoxController(boxMoveEvent => this.onBoxMoved(boxMoveEvent));

    }

    private async captureFirstScreenshot() {

        const areaHighlight = this.areaHighlight!;
        const { docMeta, pageMeta } = this.annotationEvent!;

        const rect = Arrays.first(Object.values(areaHighlight.rects));
        const areaHighlightRect = AreaHighlightRects.createFromRect(rect!);
        const pageNum = pageMeta.pageInfo.num;

        const {pageDimensions} = AreaHighlights.computePageDimensions(pageNum);

        const boxRect = areaHighlightRect.toDimensionsFloor(pageDimensions);

        const target = <HTMLElement> document.getElementById(this.createID());

        const opts: DoWriteOpts = {
            datastore: this.persistenceLayerProvider(),
            docMeta,
            pageMeta,
            pageNum,
            areaHighlight,
            target,
            areaHighlightRect,
            boxRect,
        };

        await this.asyncSerializer.execute(async () => {
            this.areaHighlight = await AreaHighlights.doWrite(opts);
        });

    }

    /**
     *
     */
    private onBoxMoved(boxMoveEvent: BoxMoveEvent) {

        // TODO: actually I think this belongs in the controller... not the view

        const annotationRect = AnnotationRects.createFromPositionedRect(boxMoveEvent.boxRect,
                                                                        boxMoveEvent.restrictionRect);

        const areaHighlightRect = new AreaHighlightRect(annotationRect);

        if (boxMoveEvent.state === "completed") {

            const annotationEvent = this.annotationEvent!;
            const { docMeta, pageMeta } = annotationEvent;
            const pageNum = pageMeta.pageInfo.num;

            const areaHighlight = pageMeta.areaHighlights[this.areaHighlight!.id];

            const {boxRect, target} = boxMoveEvent;

            const doWrite = async () => {

                const {pageDimensions} = AreaHighlights.computePageDimensions(pageNum);

                // TODO: this is a problem because the area highlight isn't created
                // until we mutate it in the JSON..
                const extractedImage
                    = await Screenshots.capture(pageNum, boxRect, target);

                const overlayRect = areaHighlightRect.toDimensions(pageDimensions);

                const position: Position = {
                    x: overlayRect.left,
                    y: overlayRect.top,
                    width: overlayRect.width,
                    height: overlayRect.height,
                };

                const rect = areaHighlightRect;

                const writeOpts: AreaHighlightWriteOpts = {
                    datastore: this.persistenceLayerProvider(),
                    docMeta,
                    pageMeta,
                    areaHighlight,
                    rect,
                    position,
                    extractedImage
                };

                const writer = AreaHighlights.write(writeOpts);

                const [writtenAreaHighlight, committer] = writer.prepare();

                this.areaHighlight = writtenAreaHighlight;

                await committer.commit();

            };

            this.asyncSerializer.execute(async () => await doWrite())
                .catch(err => log.error("Unable to update screenshot: ", err));

        } else {
            // noop
        }

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

        const pageNum = pageMeta.pageInfo.num;

        // the container must ALWAYS be the pageElement because if we use any
        // other container PDF.js breaks.
        const containerElement = this.docFormat.getPageElementFromPageNum(pageNum);

        const {pageDimensions, dimensionsElement} = AreaHighlights.computePageDimensions(pageNum);

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

        if (! this.areaHighlight!.image) {

            this.captureFirstScreenshot()
                // .catch(err => log.error("Unable to capture first screenshot: ", err));
                .catch(err => console.error("FIXME: Unable to capture first screenshot: ", err));

        }

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
