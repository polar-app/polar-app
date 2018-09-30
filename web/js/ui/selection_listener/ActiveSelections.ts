import {Point} from '../../Point';
import {MouseDirection} from '../popup/Popup';

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

                listener({
                    originPoint: originPoint!,
                    mouseDirection
                });

            }

        });

    }

}

export interface ActiveSelectionListener {
    // noinspection TsLint
    (event: ActiveSelectionEvent): void;
}

export interface ActiveSelectionEvent {
    readonly originPoint: Point;
    readonly mouseDirection: MouseDirection;
}
