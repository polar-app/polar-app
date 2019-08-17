import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {IPageInfo} from "./IPageInfo";
import {IDimensions} from "../util/IDimensions";

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

