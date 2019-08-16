import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {IDimensions} from '../util/Dimensions';

export class PageInfo extends SerializedObject implements IPageInfo {

    public readonly num: number;

    public dimensions?: IDimensions;

    constructor(val: any) {

        super(val);

        this.num = val.num;

        this.init(val);

    }

    public validate() {
        Preconditions.assertNumber(this.num, "num");
    }

}

export interface IPageInfo {

    /**
     * The page number of this page.
     */
    readonly num: number;

    /**
     * The dimensions, in pixels, of this page (if we have it).  Used for
     * rendering thumbnails, etc.  For HTML pages, this is the PHYSICAL rendering
     * of the page.  HTML pages can be VERY long so they form *logical* pages
     * as well once they are broken up into ~1000px height units.
     */
    dimensions?: IDimensions;

}
