import {isPresent} from '../../Preconditions';

export class IFrames {

    public static async waitForContentDocument(iframe: HTMLIFrameElement,
                                               options: WaitForContentDocumentOptions = { currentURL: 'about:blank'}): Promise<HTMLDocument> {

        return new Promise<HTMLDocument>(resolve => {

            function timer() {

                if(iframe.contentDocument && iframe.contentDocument!.location!.href !== options.currentURL) {
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

        while(isPresent(win.frameElement)) {

            let iframeClientRect = win.frameElement.getBoundingClientRect();

            let left = clientRect.left + iframeClientRect.left;
            let top = clientRect.top + iframeClientRect.top;
            let width = clientRect.width;
            let height = clientRect.height;
            let bottom = top + height;
            let right = left + width;

            clientRect = { left, top, width, height, bottom, right };

            win = win.parent;

        }

        return clientRect;

    }

}

interface WaitForContentDocumentOptions {
    readonly currentURL: string;
}
