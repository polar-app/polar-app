import {BaseHighlight} from 'polar-shared/src/metadata/BaseHighlight';
import {IAreaHighlight} from "polar-shared/src/metadata/IAreaHighlight";

export class AreaHighlight extends BaseHighlight implements IAreaHighlight {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

