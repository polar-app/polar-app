import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {IDimensions} from '../util/Dimensions';
import {IPageInfo} from "./IPageInfo";

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

