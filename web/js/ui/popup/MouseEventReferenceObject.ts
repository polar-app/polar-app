import Popper from 'popper.js';
import {MouseDirection} from "./MouseDirection";

export class MouseEventReferenceObject implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    public readonly boundingClientRect: ClientRect;

    constructor(mouseEvent: MouseEvent, range: Range, mouseDirection: MouseDirection) {
        this.clientHeight = 0;
        this.clientWidth = 0;

        const boundingClientRect = range.getBoundingClientRect();

        let y: number = 0;

        // the x coord should always be from the mouse.
        const x = mouseEvent.x;

        const buffer = 5;

        switch (mouseDirection) {
            case 'up':
                y = boundingClientRect.top;
                y -= buffer;
                break;

            case 'down':
                y = boundingClientRect.bottom;
                y += buffer;
                break;

        }

        this.boundingClientRect = {
            width: 0,
            height: 0,
            top: y,
            bottom: y,
            left: x,
            right: x,
        };

    }

    public getBoundingClientRect(): ClientRect {
        return this.boundingClientRect;
    }

}
