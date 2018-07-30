/**
 * The points on screen where the event happened.
 */
import {Point} from '../Point';

export class Points {

    public readonly page: Point;
    public readonly client: Point;
    public readonly offset: Point;
    public readonly pageOffset: Point;

    constructor(page: Point, client: Point, offset: Point, pageOffset: Point) {
        this.page = page;
        this.client = client;
        this.offset = offset;
        this.pageOffset = pageOffset;
    }

}
