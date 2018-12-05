import {Point} from '../../Point';
import {MouseDirection} from './Popup';
import {Simulate} from 'react-dom/test-utils';
import mouseMove = Simulate.mouseMove;

const MIN_MOUSE_DURATION = 150;

/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener,
                                   target: HTMLElement = document.body): void {

        let originPoint: Point | undefined;
        let clickTimestamp = 0;

        target.addEventListener('mousedown', (event: MouseEvent) => {
            originPoint = this.eventToPoint(event);
            clickTimestamp = Date.now();
        });

        target.addEventListener('mouseup', (event: MouseEvent) => {

            // const win = target.ownerDocument.defaultView;
            const view = event.view;
            const selection = view.getSelection();

            const point = this.eventToPoint(event);

            // const movementDistance =
            //     Math.max(Math.abs(point.x - originPoint!.x), Math.abs(point.y - originPoint!.y));
            //
            // const mouseMoved = movementDistance > 5;

            const clickTimeDelta = Date.now() - clickTimestamp;

            const mouseMoved = clickTimeDelta > MIN_MOUSE_DURATION;

            if (mouseMoved && !selection.isCollapsed) {

                const mouseDirection: MouseDirection = point.y - originPoint!.y < 0 ? 'up' : 'down';

                const range = selection.getRangeAt(0);

                const boundingClientRect = range.getBoundingClientRect();

                listener({
                    originPoint: originPoint!,
                    mouseDirection,
                    boundingClientRect,
                    selection,
                    view,
                });

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

    readonly originPoint: Point;
    readonly mouseDirection: MouseDirection;
    readonly boundingClientRect: ClientRect | DOMRect;

    /**
     * The actual selection object that we're working with.
     */
    readonly selection: Selection;

    readonly view: Window;

}

export interface ActiveSelectionEvent extends ActiveSelection {

}
