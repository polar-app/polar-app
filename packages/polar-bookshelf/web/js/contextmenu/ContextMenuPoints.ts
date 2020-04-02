import {Point} from '../Point';

export class ContextMenuPoints {


    /**
     */
    public readonly page: Point;

    /**
     *
     */
    public readonly client: Point;

    /**
     *
     */
    public readonly offset: Point;

    /**
     *
     */
    public readonly pageOffset: Point;

    constructor(opts: any) {
        this.page = opts.page;
        this.client = opts.client;
        this.offset = opts.offset;
        this.pageOffset = opts.pageOffset;
    }

}
