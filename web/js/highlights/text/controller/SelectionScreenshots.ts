import {CapturedScreenshots} from '../../../screenshots/CapturedScreenshots';
import {IFrames} from '../../../util/dom/IFrames';
import {CapturedScreenshot} from '../../../screenshots/CapturedScreenshot';

/**
 * Remove the selection, take a screenshot, then restore it.
 */
export class SelectionScreenshots {

    public static capture(doc: Document, win: Window) {

        return this.withoutRange(doc, win, range => {

            return this.captureRange(win, range);

        });

    }

    public static captureRange(win: Window, range: Range): SelectionScreenshot {
        let clientRect = this.getClientRect(range);
        clientRect = IFrames.computeTopLevelClientRect(clientRect, win);

        let capturedScreenshotPromise = CapturedScreenshots.capture(clientRect);

        return {clientRect, capturedScreenshotPromise};
    }

    static getClientRect(range: Range) {
        return range.getBoundingClientRect();
    }

    static withoutRange<T>(doc: Document, win: Window, handler: (range: Range) => T): T {

        let sel = win.getSelection();
        let range = sel.getRangeAt(0);

        doc.body.classList.toggle('selection-disabled', true);

        let result = handler(range);

        doc.body.classList.toggle('selection-disabled', false);

        return result;

    }

}

export interface SelectionScreenshot {

    /**
     * The clientRect with iframes factored in, used to take this screenshot.
     */
    readonly clientRect: ClientRect;

    readonly capturedScreenshotPromise: Promise<CapturedScreenshot>;

}
