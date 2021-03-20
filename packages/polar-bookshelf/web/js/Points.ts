import {Point} from './Point';

export class Points {

    /**
     * Assume that the given rect is relative to the point and return the new
     * rect.
     *
     */
    public static relativeTo(origin: Point, point: Point): Point {

        return {
            x: Math.round(point.x - origin.x),
            y: Math.round(point.y - origin.y)
        };

    }

}
