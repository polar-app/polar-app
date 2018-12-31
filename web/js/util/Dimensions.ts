/**
 * Simple dimension of a Rect.
 */
import {Preconditions} from '../Preconditions';

export class Dimensions {

    /**
     * This width of this rect.
     */
    public width: number;

    /**
     * This height of this rect.
     */
    public height: number;

    constructor(obj: IDimensions) {

        /**
         * This width of this rect.
         *
         * @type {number}
         */
        this.width = obj.width;
        this.height = obj.height;

        Preconditions.assertNumber(this.height, "height");
        Preconditions.assertNumber(this.width, "width");

    }

    get area() {
        return this.width * this.height;
    }

    public toString() {
        return `${this.width}x${this.height}`;
    }

}

export interface IDimensions {

    /**
     * This width of this rect.
     */
    readonly width: number;

    /**
     * This height of this rect.
     */
    readonly height: number;

}
