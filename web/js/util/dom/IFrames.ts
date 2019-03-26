import {isPresent} from '../../Preconditions';

export class IFrames {

    public static async waitForContentDocument(iframe: HTMLIFrameElement,
                                               options: WaitForContentDocumentOptions = { currentURL: 'about:blank'}): Promise<HTMLDocument> {

        return new Promise<HTMLDocument>(resolve => {

            function timer() {

                if (iframe.contentDocument && iframe.contentDocument!.location!.href !== options.currentURL) {
                    resolve(iframe.contentDocument);
                    return;
                }

                setTimeout(timer, 100);
            }

            timer();

        });

    }

    /**
     * Compute the rect in the given window from the perspective of the top level
     * window.  We use the frameElement and walk backwards.
     *
     * @param clientRect
     * @param win
     */
    public static computeTopLevelClientRect(clientRect: ClientRect, win: Window): ClientRect {

        while (isPresent(win.frameElement)) {

            const iframeClientRect = win.frameElement.getBoundingClientRect();

            const left = clientRect.left + iframeClientRect.left;
            const top = clientRect.top + iframeClientRect.top;
            const width = clientRect.width;
            const height = clientRect.height;
            const bottom = top + height;
            const right = left + width;

            clientRect = { left, top, width, height, bottom, right };

            win = win.parent;

        }

        return clientRect;

    }

}

interface WaitForContentDocumentOptions {
    readonly currentURL: string;
}
