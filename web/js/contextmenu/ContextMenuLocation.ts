import {Point} from '../Point';
import {ContextMenuPoints} from './ContextMenuPoints';

export class ContextMenuLocation {


    /**
     * The page point where this was defined.
     *
     * @deprecated
     */
    public readonly point: Point;

    /**
     *
     */
    public readonly points: ContextMenuPoints;

    /**
     *
     * The page number this event occurred on.
     */
    public readonly pageNum: number;

    constructor(opts: any) {
        this.point = opts.point;
        this.points = opts.points;
        this.pageNum = opts.pageNum;
    }

}
