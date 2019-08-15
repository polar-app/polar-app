import {Preconditions} from '../Preconditions';
import {Image} from './Image';
import {ISODateTimeString} from './ISODateTimeStrings';

export class Thumbnail extends Image implements IThumbnail {

    public readonly id: string;

    public created: ISODateTimeString;

    constructor(opts: any) {

        super(opts);

        this.id = opts.id;
        this.created = opts.created;

        this.init(opts);

    }

    validate() {

        super.validate();

        Preconditions.assertPresent(this.id, "id");
        Preconditions.assertPresent(this.created, "created");

    }

}

export interface IThumbnail {

    /**
     * The unique ID for this object.
     */
    readonly id: string;

    /**
     * The time this object was created
     *
     */
    created: ISODateTimeString;

}
