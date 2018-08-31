import {Screenshots} from '../../../screenshots/Screenshots';
import {IFrames} from '../../../util/dom/IFrames';
import {Screenshot} from '../../../screenshots/Screenshot';

/**
 * Remove the selection, take a screenshot, then restore it.
 */
export class SelectionScreenshots {

    public static async capture(win: Window) {

        return await this.withoutRange(win, async range => {

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

    static async withoutRange<T>(win: Window, handler: (range: Range) => Promise<T>): Promise<T> {

        let sel = win.getSelection();
        let range = sel.getRangeAt(0);

        sel.empty();

        let result = await handler(range);

        // now add the range back in so that other tools can use it.
        sel.addRange(range);

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
