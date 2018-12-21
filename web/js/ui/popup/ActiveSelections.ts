import {Point} from '../../Point';
import {MouseDirection} from './Popup';
import {Simulate} from 'react-dom/test-utils';
import mouseMove = Simulate.mouseMove;
import {Logger} from '../../logger/Logger';
import {isPresent} from '../../Preconditions';
import {Selections} from '../../highlights/text/selection/Selections';
import {Ranges} from '../../highlights/text/selection/Ranges';

const log = Logger.create();

const MIN_MOUSE_DURATION = 50;


/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener,
                                   target: HTMLElement = document.body): void {

        let originPoint: Point | undefined;
        let clickTimestamp = 0;

        let activeSelection: ActiveSelection | undefined;

        type EventState = 'none' | 'selecting' | 'selected' | 'deselecting';

        let state: EventState = 'none';

        const changeState = (newState: EventState) => {
            state = newState;
        };

        target.addEventListener('mousedown', (event: MouseEvent) => {

            //
            // const clearSelection = () => {
            //
            //     const sel = event.view.getSelection();
            //
            //     if (sel.rangeCount > 1) {
            //         for (let idx = 1; idx < sel.rangeCount; idx++) {
            //             sel.removeRange(sel.getRangeAt(idx));
            //         }
            //     }
            //
            // };
            //
            // clearSelection();
            //

            if (!activeSelection) {
                originPoint = this.eventToPoint(event);
                clickTimestamp = Date.now();
                changeState('selecting');

            } else {

                activeSelection = { ...activeSelection, type: 'destroyed' };
                listener(activeSelection);
                activeSelection = undefined;

                changeState('deselecting');
            }

        });

        target.addEventListener('mouseup', (event: MouseEvent) => {

            if (state === 'deselecting') {
                changeState('none');
                return;
            }

            // const win = target.ownerDocument.defaultView;
            const view = event.view;
            const selection = view.getSelection();

            const point = this.eventToPoint(event);

            let element: HTMLElement;

            if (event.target instanceof Node) {

                if (event.target instanceof HTMLElement) {
                    element = event.target;
                } else {
                    element = event.target.parentElement!;
                }

            } else {
                log.warn("Event target is not node: ", event.target);
                return;
            }

            const clickTimeDelta = Date.now() - clickTimestamp;

            const mouseMoved = clickTimeDelta > MIN_MOUSE_DURATION;

            const ranges = Selections.toRanges(selection);

            let hasText: boolean = false;

            for (const range of ranges) {
                if (Ranges.hasText(range)) {
                    hasText = true;
                    break;
                }
            }

            if (hasText && mouseMoved && !selection.isCollapsed) {

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

                changeState('selected');

            } else {
                changeState('none');
            }

        });

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
