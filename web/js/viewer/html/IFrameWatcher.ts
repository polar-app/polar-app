/**
 * Assumes that you have tried to change the URL for an iframe and watches for
 * it to start loading properly.
 */
import {Preconditions} from '../../Preconditions';
import {IFrames} from '../../util/dom/IFrames';
import {Logger} from '../../logger/Logger';
import {DocumentReadyStates} from '../../util/dom/DocumentReadyStates';

const log = Logger.create();

export class IFrameWatcher {

    private readonly iframe: HTMLIFrameElement;
    private readonly callback: () => void;

    constructor(iframe: HTMLIFrameElement, callback: () => void) {

        this.iframe = Preconditions.assertNotNull(iframe, "iframe");
        this.callback = Preconditions.assertNotNull(callback, "callback");

    }

    start() {

        this.execute()
            .catch(err => log.error("Failed watching for iframe: ", err ))

    }

    private async execute(): Promise<void> {

        console.log("FIXME1");
        await IFrames.waitForContentDocument(this.iframe);
        console.log("FIXME2");
        await DocumentReadyStates.waitFor(this.iframe.contentDocument!, 'complete');
        console.log("FIXME3");
        this.callback();

    }

}
