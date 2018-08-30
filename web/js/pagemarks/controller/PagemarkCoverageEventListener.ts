import {WebController} from '../../controller/WebController';
import {Model} from '../../Model';
import {DocFormat} from '../../docformat/DocFormat';
import {Logger} from '../../logger/Logger';
import {DocFormatFactory} from '../../docformat/DocFormatFactory';
import {KeyEvents} from '../../KeyEvents';
import {Elements} from '../../util/Elements';

const log = Logger.create();

export class PagemarkCoverageEventListener {

    private readonly controller: WebController;
    private readonly model: Model;

    private keyActivated: boolean = false;

    private readonly docFormat: DocFormat;

    /**
     */
    constructor(controller: WebController, model: Model) {
        this.controller = controller;
        this.model = model;
        this.docFormat = DocFormatFactory.getInstance();
    }

    start() {

        log.info("Starting...");
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
        log.info("Starting...done");

    }

    onDocumentLoaded() {

        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));

        document.querySelectorAll(".page").forEach(pageElement => {
            pageElement.addEventListener("click", this.mouseListener.bind(this));
        });

    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    keyListener(event: KeyboardEvent) {

        if(!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

    }

    async mouseListener(event: MouseEvent) {

        if(!event) {
            throw new Error("no event");
        }

        if(!this.keyActivated) {
            return;
        }

        await this.onActivated(event);

    }

    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    async onActivated(event: MouseEvent) {

        // this should always be .page since we're using currentTarget
        let pageElement = Elements.untilRoot(event.currentTarget, ".page");

        let pageHeight = pageElement.clientHeight;

        let eventTargetOffset = Elements.getRelativeOffsetRect(<HTMLElement>event.target, pageElement);

        let mouseY = eventTargetOffset.top + event.offsetY;

        let percentage = (mouseY / pageHeight) * 100;

        log.info("percentage: ", percentage);

        let pageNum = this.docFormat.getPageNumFromPageElement(pageElement);
        this.controller.erasePagemark(pageNum);
        await this.controller.createPagemark(pageNum, {percentage});

    }

}
