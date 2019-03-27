import {Preconditions} from '../../Preconditions';

export class FrameEvents {

    /**
     * Calculate the points of an mouseEvent in the current window relative to the
     * frame which originated the mouseEvent.
     */
    public static calculatePoints(iframe: HTMLIFrameElement, mouseEvent: MouseEvent): any {

        // FIXME: make sure the mouseEvent ACTUALLY happened in the iframe because
        // if it didn't then the calculations here won't make any sense.

        Preconditions.assertNotNull(iframe, "iframe");

        if (!mouseEvent.target) {
            throw new Error("No target");
        }

        // right now we're forcing the cast to element as there's some sort of
        // issue with instanceof and HTMLElement returning false.
        const targetElement = <HTMLElement> mouseEvent.target;

        if (targetElement.ownerDocument !== iframe.contentDocument) {
            throw new Error("Event did not occur in specified iframe");
        }

        const result = {

            page: {
                x: 0,
                y: 0
            },
            client: {
                x: 0,
                y: 0
            },
            offset: {
                x: 0,
                y: 0
            }

        };

        // We need a frame of reference to translate the two coordinate systems.
        // using screenX and screenY solve this problem for us.  We can
        // translate the the screen position to the client (viewport) position,
        // and then based on the scrolling positions of the document translate
        // that into the page positions.
        //

        result.client.x = mouseEvent.screenX - window.screenX;

        const electronScreen = <any> window.screen;

        const availTop = electronScreen.availTop;

        // we have to adjust by window.screen.availTop to account for the electron
        // navbar.  This isn't standardized though and might not be portable in
        // the future but it works for now.

        result.client.y = mouseEvent.screenY - window.screenY - availTop;

        // FIXME: removing these two below fixes pagemarks for PHZ files but
        // I'm pretty sure that scrollX MUST be used to get the right position.
        // it might be that my code is incorrect here.

        // TODO: I think it's because we're IN the iframe so there is no scroll?

        // result.page.x = result.client.x + window.scrollX;
        // result.page.y = result.client.y + window.scrollY;

        // FIXME: this is better but if we then click on a element within the parent
        // window like a text highlight

        result.page.x = result.client.x;
        result.page.y = result.client.y;

        result.offset.x = mouseEvent.pageX;
        result.offset.y = mouseEvent.pageY;

        // result.page.x = result.client.x;
        // result.page.y = result.client.y;

        return result;

    }

}
