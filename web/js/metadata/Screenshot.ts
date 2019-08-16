import {Preconditions} from '../Preconditions';
import {Image} from './Image';
import {ISODateTimeString} from './ISODateTimeStrings';
import {IScreenshot} from "./IScreenshot";

export class Screenshot extends Image implements IScreenshot {

    public readonly id: string;

    public created: ISODateTimeString;

    constructor(opts: any) {

        super(opts);

        this.id = opts.id;
        this.created = opts.created;

        this.init(opts);

    }

    public validate() {

        super.validate();

        Preconditions.assertPresent(this.id, "id");
        Preconditions.assertPresent(this.created, "created");

    }

}

