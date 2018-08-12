import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';

export class PageInfo extends SerializedObject {

    /**
     * The page number of this page.
     */
    public readonly num: number;

    constructor(val: any) {

        super(val);

        this.num = val.num;

        this.init(val);

    }

    validate() {
        Preconditions.assertNumber(this.num, "num");
    }

}
