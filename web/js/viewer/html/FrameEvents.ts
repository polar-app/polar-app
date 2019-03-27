import {Preconditions} from '../../Preconditions';
import {Optional} from '../../util/ts/Optional';
import {IPoint} from '../../Point';

export class FrameEvents {

    /**
     * Calculate the points of an mouseEvent in the current window relative to the
     * frame which originated the mouseEvent.
     */
    public static calculatePoints(iframe: HTMLIFrameElement, mouseEvent: MouseEvent): FramePoints {

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

        // availTop is not part of any standards so we have to use it properly
        const availTop = Optional.of(electronScreen.availTop).getOrElse(0);

        // we have to adjust by window.screen.availTop to account for the electron
        // navbar.  This isn't standardized though and might not be portable in
        // the future but it works for now.

        result.client.y = mouseEvent.screenY - window.screenY - availTop;

        // TODO: removing these two below fixes pagemarks for PHZ files but
        // I'm pretty sure that scrollX MUST be used to get the right position.
        // it might be that my code is incorrect here.

        // TODO: I think it's because we're IN the iframe so there is no scroll?

        // result.page.x = result.client.x + window.scrollX;
        // result.page.y = result.client.y + window.scrollY;

        // TODO: this is better but if we then click on a element within the
        // parent window like a text highlight

        result.page.x = result.client.x;
        result.page.y = result.client.y;

        result.offset.x = mouseEvent.pageX;
        result.offset.y = mouseEvent.pageY;

        // result.page.x = result.client.x;
        // result.page.y = result.client.y;

        return result;

    }

}

// https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y

// pageX, pageY, screenX, screenY, clientX, and clientY returns a number which
// indicates the number of physical “CSS pixels” a point is from the reference
// point. The event point is where the user clicked, the reference point is a
// point in the upper left. These properties return the horizontal and vertical
// distance from that reference point.
//
// pageX and pageY:

// Relative to the top left of the fully rendered content area in the browser.
// This reference point is below the URL bar and back button in the upper left.
// This point could be anywhere in the browser window and can actually change
// location if there are embedded scrollable pages embedded within pages and the
// user moves a scrollbar.
//
// screenX and screenY:

// Relative to the top left of the physical screen/monitor, this reference point
// only moves if you increase or decrease the number of monitors or the monitor
// resolution.
//
// clientX and clientY:

// Relative to the upper left edge of the content area (the viewport) of the
// browser window. This point does not move even if the user moves a scrollbar
// from within the browser.

export interface FramePoints {

    readonly page: IPoint;

    readonly client: IPoint;

    readonly offset: IPoint;

}
