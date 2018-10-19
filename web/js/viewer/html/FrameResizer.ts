import {Optional} from '../../util/ts/Optional';
import {Styles} from '../../util/Styles';
import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';

const log = Logger.create();

/**
 *
 * Resize the iframe base on the internal content document. This way the iframe
 * size in the host window has the size of the content and there is no scroll
 * bar present.
 */
export class FrameResizer {

    private readonly parent: HTMLElement;
    private readonly iframe: HTMLIFrameElement;

    private height: number | undefined;

    // TODO:
    //
    // this may be a better way to do the resize animation frames.
    //
    // https://stackoverflow.com/questions/1835219/is-there-an-event-that-fires-on-changes-to-scrollheight-or-scrollwidth-in-jquery

    constructor(parent: HTMLElement, iframe: HTMLIFrameElement) {

        this.parent = Preconditions.assertPresent(parent);
        this.iframe = Preconditions.assertPresent(iframe);

        // the current height
        this.height = undefined;

    }

    /**
     * Perform the resize now.
     *
     * @param force True when we should force.  This way, if we're doing any
     * sort of caching or throttling of resize, we can just force it one last
     * time.
     */
    public resize(force: boolean = false) {

        // TODO: accidental horizontal overflow...
        //
        // - I can see if the CSS is done rendering.. there might still be CSS
        //   transitions and other issues.
        //
        // - I could see if the CSS is loaded, and that no more images or other
        //   resources have changed and then fix the page to that dimension.
        //
        // - I could back off significantly in duration if only a small percentage
        //   of the page height has changed.  For example, if we're less than 1%
        //   I can just wait until the final rendering.  We are often only off
        //   by a few px.
        //

        const contentDocument = this.iframe.contentDocument;

        if (! contentDocument) {
            return;
        }

        if (! contentDocument.body) {
            return;
        }

        const height = Styles.parsePX(Optional.of(this.iframe.style.height)
                                        .filter( (current: any) => current !== null)
                                        .filter( current => current !== "")
                                        .getOrElse("0px"));

        const newHeight = Math.max(contentDocument.documentElement.scrollHeight,
                                   contentDocument.body.scrollHeight);

        const delta = Math.abs(newHeight - height);

        // delta as a percentage of total height.
        const deltaPerc = 100 * (delta / height);

        if (! force && deltaPerc < 5) {
            return;
        }

        // we basically keep polling.
        if (height !== newHeight) {
            // log.info(`Setting new height to: ${newHeight} vs previous ${this.iframe.style.height}`);
            this.iframe.style.height = `${newHeight}px`;
            this.height = newHeight;
        }

    }

}

