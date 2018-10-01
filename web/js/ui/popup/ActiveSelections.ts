import {Point} from '../../Point';
import {MouseDirection} from './Popup';

/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener,
                                   target: HTMLElement = document.body): void {

        let originPoint: Point | undefined;

        document.addEventListener('mousedown', (event: MouseEvent) => {

            originPoint = this.eventToPoint(event);

        });

        document.addEventListener('mouseup', (event: MouseEvent) => {

            // const win = target.ownerDocument.defaultView;
            const win = event.view;
            const selection = win.getSelection();

            const point = this.eventToPoint(event);

            if (!selection.isCollapsed) {

                const mouseDirection: MouseDirection = point.y - originPoint!.y < 0 ? 'up' : 'down';

                const range = selection.getRangeAt(0);

                const boundingClientRect = range.getBoundingClientRect();

                listener({
                    originPoint: originPoint!,
                    mouseDirection,
                    boundingClientRect,
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

}

export interface ActiveSelectionEvent extends ActiveSelection {

}
