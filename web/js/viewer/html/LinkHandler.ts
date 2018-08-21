import {shell} from 'electron';
import {IFrames} from '../../util/dom/IFrames';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';
import {Logger} from '../../logger/Logger';

const log = Logger.create();

/**
 * The link handler works with the the iframe, and all child iframes, and
 * intercepts all link clicks, and aborts them, forwarding them to the shell.
 */
export class LinkHandler {

    private readonly iframe: HTMLIFrameElement;

    constructor(iframe: HTMLIFrameElement) {
        this.iframe = iframe;
    }

    async start() {

        let doc = await IFrames.waitForContentDocument(this.iframe);

        await DocumentReadyStates.waitFor(doc, 'interactive');

        this.setupEventHandlers(doc);


    }

    private setupEventHandlers(doc: HTMLDocument) {
        this.setupClickHandlers(doc);
        this.setupBeforeUnload(doc);

        log.info("Added event handlers to prevent link navigation");

    }

    private setupClickHandlers(doc: HTMLDocument) {

        // click and enter need to be aborted here..
        doc.querySelectorAll('a')
            .forEach(anchor => anchor.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
            }));

    }

    private setupBeforeUnload(doc: HTMLDocument) {

        // prevent the document from being unloaded.
        doc.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.stopPropagation();
        });

    }

}
