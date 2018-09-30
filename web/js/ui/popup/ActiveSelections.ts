import {Point} from '../../Point';
import {MouseDirection} from './Popup';

/**
 * Listens for when a new text selection has been created
 */
export class ActiveSelections {

    public static addEventListener(listener: ActiveSelectionListener): void {

        let originPoint: Point | undefined;

        document.addEventListener('mousedown', (event: MouseEvent) => {

            originPoint = {
                x: event.x,
                y: event.y
            };

        });

        document.addEventListener('mouseup', (event: MouseEvent) => {

            if (!window.getSelection().isCollapsed) {

                const mouseDirection: MouseDirection = event.y - originPoint!.y < 0 ? 'up' : 'down';

                const range = window.getSelection().getRangeAt(0);

                const boundingClientRect = range.getBoundingClientRect();

                listener({
                    originPoint: originPoint!,
                    mouseDirection,
                    boundingClientRect,
                });

            }

        });

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
