import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';
import {FrameResizer} from './FrameResizer';

const log = Logger.create();

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
export class BackgroundFrameResizer {

    private readonly parent: HTMLElement;
    private readonly iframe: HTMLIFrameElement;

    // how long between polling should we wait to expand the size.
    private readonly timeoutInterval = 250;

    private resizes: number = 0;

    private frameResizer: FrameResizer;

    constructor(parent: HTMLElement, iframe: HTMLIFrameElement) {

        this.parent = Preconditions.assertPresent(parent);
        this.iframe = Preconditions.assertPresent(iframe);

        this.frameResizer = new FrameResizer(parent, iframe);

    }

    public start() {

        this.resizeParentInBackground()
            .catch(err => log.error("Could not resize in background: ", err));
    }

    private async resizeParentInBackground() {

        if (this.resizes > MAX_RESIZES) {
            log.info("Hit MAX_RESIZES: " + MAX_RESIZES);
            await this.doBackgroundResize(true);
            return;
        } else {
            await this.doBackgroundResize(false);
        }

        setTimeout(() => this.resizeParentInBackground(), this.timeoutInterval);

    }

    /**
     * Perform the resize now.
     *
     * @param force True when this is the final resize before terminating.  This
     * way, if we're doing any sort of caching or throttling of resize, we can
     * just force it one last time.
     */
    private async doBackgroundResize(force: boolean) {

        ++this.resizes;

        return this.frameResizer.resize(force);

    }

}
