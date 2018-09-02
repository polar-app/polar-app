import {Screenshots} from '../../../screenshots/Screenshots';
import {IFrames} from '../../../util/dom/IFrames';
import {Screenshot} from '../../../screenshots/Screenshot';

/**
 * Remove the selection, take a screenshot, then restore it.
 */
export class SelectionScreenshots {

    public static async capture(doc: Document, win: Window) {

        return await this.withoutRange(doc, win, async range => {

            return this.captureRange(win, range);

        });

    }

    public static async captureRange(win: Window, range: Range): Promise<SelectionScreenshot> {
        let clientRect = this.getClientRect(range);
        clientRect = IFrames.computeTopLevelClientRect(clientRect, win);

        let screenshot = await Screenshots.capture(clientRect);
        return {clientRect, screenshot};
    }

    static getClientRect(range: Range) {
        return range.getBoundingClientRect();
    }

    static async withoutRange<T>(doc: Document, win: Window, handler: (range: Range) => Promise<T>): Promise<T> {

        let sel = win.getSelection();
        let range = sel.getRangeAt(0);

        doc.body.classList.toggle('selection-disabled', true);

        let result = await handler(range);

        doc.body.classList.toggle('selection-disabled', false);

        return result;

    }

}

export interface SelectionScreenshot {

    /**
     * The clientRect with iframes factored in, used to take this screenshot.
     */
    readonly clientRect: ClientRect;

    readonly screenshot: Screenshot;

}
