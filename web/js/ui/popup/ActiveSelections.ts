import {Point} from '../../Point';
import {MouseDirection} from './Popup';
import {Simulate} from 'react-dom/test-utils';
import mouseMove = Simulate.mouseMove;
import {Logger} from '../../logger/Logger';
import {isPresent} from '../../Preconditions';
import {Selections} from '../../highlights/text/selection/Selections';
import {Ranges} from '../../highlights/text/selection/Ranges';

const log = Logger.create();

/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener,
                                   target: HTMLElement = document.body): void {

        let originPoint: Point | undefined;

        let activeSelection: ActiveSelection | undefined;


        target.addEventListener('mousedown', (event: MouseEvent) => {

            if (!activeSelection) {
                originPoint = this.eventToPoint(event);
            }

        });

        target.addEventListener('mouseup', (event: MouseEvent) => {

            const handleMouseEvent = () => {

                type EventFired = 'none' | 'created' | 'destroyed';

                let hasActiveTextSelection: boolean = false;
                let eventFired: EventFired = 'none';

                try {

                    const view = event.view;
                    const selection = view.getSelection();

                    hasActiveTextSelection = this.hasActiveTextSelection(selection);

                    const point = this.eventToPoint(event);
                    const element = this.targetElementForEvent(event);

                    if (! element) {
                        log.warn("Event target is not node: ", event.target);
                        return;
                    }

                    if (activeSelection) {

                        activeSelection = { ...activeSelection, type: 'destroyed' };
                        listener(activeSelection);
                        activeSelection = undefined;

                        eventFired = 'destroyed';

                    }

                    if (hasActiveTextSelection) {

                        const mouseDirection: MouseDirection = point.y - originPoint!.y < 0 ? 'up' : 'down';

                        const range = selection.getRangeAt(0);

                        const boundingClientRect = range.getBoundingClientRect();

                        activeSelection = {
                            element,
                            originPoint: originPoint!,
                            mouseDirection,
                            boundingClientRect,
                            selection,
                            view,
                            type: 'created'
                        };

                        listener(activeSelection);

                        eventFired = 'created';

                    }

                } finally {
                    // console.log(`mouseup: hasActiveTextSelection: ${hasActiveTextSelection}, eventFired: ${eventFired}`);
                }

            };

            // needs to be called via setTimeout becuase if we click 'on' the
            // selection there's a bug where the selection is still present and
            // isn't removed.  Allowing the event to complete by taking this
            // event handler and pushing it on the event queue allows the
            // selection to be removed by the default handler once it bubbles
            // up.
            setTimeout(() => handleMouseEvent(), 1);

        });

    }

    private static targetElementForEvent(event: MouseEvent): HTMLElement | undefined {

        if (event.target instanceof Node) {

            if (event.target instanceof HTMLElement) {
                return event.target;
            } else {
                return event.target.parentElement!;
            }

        } else {
            log.warn("Event target is not node: ", event.target);
        }

        return undefined;

    }

    private static hasActiveTextSelection(selection: Selection) {

        const ranges = Selections.toRanges(selection);

        for (const range of ranges) {
            if (Ranges.hasText(range)) {
                return true;
            }
        }

        return false;

    }

    private static eventToPoint(event: MouseEvent) {

        return {
            x: event.offsetX,
            y: event.offsetY
        };

    }


}

export interface ActiveSelectionListener {
    // noinspection TsLint
    (event: ActiveSelectionEvent): void;
}


export interface ActiveSelection {

    readonly element: HTMLElement;
    readonly originPoint: Point;
    readonly mouseDirection: MouseDirection;
    readonly boundingClientRect: ClientRect | DOMRect;

    /**
     * The actual selection object that we're working with.
     */
    readonly selection: Selection;

    readonly view: Window;

    readonly type: ActiveSelectionType;

}

export type ActiveSelectionType = 'created' | 'destroyed';

export interface ActiveSelectionEvent extends ActiveSelection {

}
