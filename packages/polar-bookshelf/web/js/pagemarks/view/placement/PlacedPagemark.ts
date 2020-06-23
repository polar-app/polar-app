import {Rect} from '../../../Rect';

export class PlacedPagemark {

    /**
     * The place on the page to place this pagemark.
     */
    public readonly rect: Rect;

    constructor(opts: any) {
        this.rect = opts.rect;
    }

}
