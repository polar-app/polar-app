import Popper from 'popper.js';

/**
 * Create a popper around a specific point.  Designed to create one on mouse
 * clicks events.
 */
export class PointReferenceObject  implements Popper.ReferenceObject {

    public readonly clientHeight: number;
    public readonly clientWidth: number;
    public readonly boundingClientRect: ClientRect;

    constructor(x: number, y: number) {
        this.clientHeight = 0;
        this.clientWidth = 0;

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
