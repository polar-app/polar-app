import {Optional} from '../../util/ts/Optional';
import {Styles} from '../../util/Styles';

const MAX_RESIZES = 25;

/**
 * Listens to the main iframe load and resizes it appropriately based on the
 * scroll height of the document.
 *
 * The loader polls the content iframe every 50ms and if the height changes
 * automatically synchronizes it with the content document.  There's really no
 * way to get loading 'progress' so the trick is to just poll fast enough to get
 * the document size so that the user never notices.
 */
export class FrameResizer {

    private readonly parent: HTMLElement;
    private readonly iframe: HTMLIFrameElement;

    // how long between polling should we wait to expand the size.
    private readonly timeoutInterval = 250;

    private height: number | undefined;

    private resizes: number = 0;

    // TODO:
    //
    // this may be a better way to do the resize animation frames.
    //
    // https://stackoverflow.com/questions/1835219/is-there-an-event-that-fires-on-changes-to-scrollheight-or-scrollwidth-in-jquery

    constructor(parent: HTMLElement, iframe: HTMLIFrameElement) {

        if(!parent) {
            throw new Error("No parent");
        }

        if(!iframe) {
            throw new Error("No iframe");
        }

        this.parent = parent;
        this.iframe = iframe;

        // the current height
        this.height = undefined;

    }

    start() {
        this.resizeParentInBackground();
    }

    resizeParentInBackground() {

        if(this.resizes > MAX_RESIZES) {
            console.log("Hit MAX_RESIZES: " + MAX_RESIZES);
            this.doResize(true);
            return;
        } else {
            this.doResize(false);
        }

        setTimeout(this.resizeParentInBackground.bind(this), this.timeoutInterval);

    }

    /**
     * Perform the resize now.
     *
     * @param final True when this is the final resize before terminating.  This
     * way, if we're doing any sort of caching or throttling of resize, we can
     * just force it one last time.
     */
    doResize(final: boolean) {

        ++this.resizes;

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

        let contentDocument = this.iframe.contentDocument;

        if(! contentDocument)
            return;

        if(! contentDocument.body)
            return;

        let height = Styles.parsePX(Optional.of(this.iframe.style.height)
                                        .filter( (current: any) => current !== null)
                                        .filter( current => current !== "")
                                        .getOrElse("0px"));

        let newHeight = contentDocument.body.scrollHeight;

        let delta = Math.abs(newHeight - height);

        //delta as a percentage of total height.
        let deltaPerc = 100 *(delta / height);

        if(! final && deltaPerc < 5) {
            //console.log(`Skipping resize as delta is too small (deltaPerc=${deltaPerc}, height=${height}, newHeight=${newHeight})`)
            return;
        }

        // we basically keep polling.
        if(height !== newHeight) {
            //console.log(`Setting new height to: ${newHeight} vs previous ${this.iframe.style.height}`);
            this.iframe.style.height = `${newHeight}px`;
            this.height = newHeight;
        }

    }

}
