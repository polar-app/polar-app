import {WebController} from '../../controller/WebController';
import {Model} from '../../model/Model';
import {DocFormat} from '../../docformat/DocFormat';
import {Logger} from '../../logger/Logger';
import {DocFormatFactory} from '../../docformat/DocFormatFactory';
import {KeyEvents} from '../../KeyEvents';
import {Elements} from '../../util/Elements';
import {RendererAnalytics} from '../../ga/RendererAnalytics';
import {Percentages} from '../../util/Percentages';

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

    public start() {

        log.info("Starting...");
        this.model.registerListenerForDocumentLoaded(this.onDocumentLoaded.bind(this));
        log.info("Starting...done");

    }

    private onDocumentLoaded() {

        log.info("Document loaded... installing listeners...");

        document.addEventListener("keyup", this.keyListener.bind(this));
        document.addEventListener("keydown", this.keyListener.bind(this));

        const pages = document.querySelectorAll(".page");
        pages.forEach(pageElement => {
            pageElement.addEventListener("click", this.mouseListener.bind(this));
        });

        if(pages.length === 0) {
            log.warn("No pages found for click listener.");
        } else {
            log.debug("Added click listener to N pages: " + pages.length);
        }

        log.info("Document loaded... installing listeners...done");

    }

    /**
     * Track that we've selected 'e' on the keyboard,
     */
    private keyListener(event: KeyboardEvent) {

        if (!event) {
            throw new Error("no event");
        }

        this.keyActivated = KeyEvents.isKeyMetaActive(event);

    }

    private async mouseListener(event: MouseEvent) {

        if (!event) {
            throw new Error("no event");
        }

        if (!this.keyActivated) {
            return;
        }

        await this.onActivated(event);

    }

    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
    private async onActivated(event: MouseEvent) {

        // this should always be .page since we're using currentTarget
        const pageElement = Elements.untilRoot(event.currentTarget, ".page");

        const pageHeight = pageElement.clientHeight;

        const eventTargetOffset = Elements.getRelativeOffsetRect(<HTMLElement> event.target, pageElement);

        const mouseY = eventTargetOffset.top + event.offsetY;

        const percentage = Percentages.calculate(mouseY, pageHeight);

        log.info("percentage: ", percentage);

        const pageNum = this.docFormat.getPageNumFromPageElement(pageElement);

        RendererAnalytics.event({category: 'user', action: 'created-pagemark-via-keyboard'});

        this.controller.erasePagemark(pageNum);
        await this.controller.createPagemark(pageNum, {percentage});

    }

}
