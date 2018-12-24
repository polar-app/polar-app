import {Optional} from '../../util/ts/Optional';
import {Styles} from '../../util/Styles';
import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';
import {Functions} from '../../util/Functions';
import {Documents} from './Documents';

const log = Logger.create();

/**
 *
 * Resize the iframe base on the internal content document. This way the iframe
 * size in the host window has the size of the content and there is no scroll
 * bar present.
 */
export class FrameResizer {

    private readonly parent: HTMLElement;
    private readonly host: HTMLIFrameElement | Electron.WebviewTag;

    private height: number | undefined;

    // TODO:
    //
    // this may be a better way to do the resize animation frames.
    //
    // https://stackoverflow.com/questions/1835219/is-there-an-event-that-fires-on-changes-to-scrollheight-or-scrollwidth-in-jquery

    constructor(parent: HTMLElement, iframe: HTMLIFrameElement | Electron.WebviewTag) {

        this.parent = Preconditions.assertPresent(parent);
        this.host = Preconditions.assertPresent(iframe);

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
    public async resize(force: boolean = false) {

        // TODO: accidental horizontal overflow...
        //
        // - I can see if the CSS is done rendering.. there might still be CSS
        //   transitions and other issues.
        //
        // - I could see if the CSS is loaded, and that no more images or other
        //   resources have changed and then fix the page to that dimension.
        //
        // - I could back off significantly in duration if only a small
        // percentage of the page height has changed.  For example, if we're
        // less than 1% I can just wait until the final rendering.  We are
        // often only off by a few px.

        const newHeightAsOptional = await this.getDocumentHeight();

        if (! newHeightAsOptional.isPresent()) {
            return;
        }

        const newHeight = newHeightAsOptional.get();

        const height = Styles.parsePX(Optional.of(this.host.style.height)
                                        .filter( (current: any) => current !== null)
                                        .filter( current => current !== "")
                                        .getOrElse("0px"));

        const delta = Math.abs(newHeight - height);

        // delta as a percentage of total height.
        const deltaPerc = 100 * (delta / height);

        if (! force && deltaPerc < 5) {
            return;
        }

        // we basically keep polling.
        if (force || height !== newHeight) {

            const heightElement = this.host.parentElement!;

            // log.info(`Setting new height to: ${newHeight} vs previous
            // ${this.iframe.style.height}`);
            this.host.style.minHeight = `${newHeight}px`;
            heightElement.style.minHeight = `${newHeight}px`;
            heightElement.setAttribute('data-height', `${newHeight}`);

            this.height = newHeight;

        }

    }

    /**
     * Get the internal height of the given document OR return undefined if
     * we don't have it yet. We might not have it if the document is still
     * loading.
     */
    private async getDocumentHeight(): Promise<Optional<number>> {

        if (this.host instanceof HTMLIFrameElement) {
            return this.getDocumentHeightForIFrame(this.host);
        } else {
            return this.getDocumentHeightForWebview(this.host);
        }

    }

    private async getDocumentHeightForIFrame(iframe: HTMLIFrameElement): Promise<Optional<number>> {
        return Optional.of(Documents.height(iframe.contentDocument));

    }

    private async getDocumentHeightForWebview(webview: Electron.WebviewTag): Promise<Optional<number>> {

        const webContents = webview.getWebContents();

        const script = Functions.functionToScript(Documents.height);
        const height: number | undefined = await webContents.executeJavaScript(script);

        return Optional.of(height);

    }

}

