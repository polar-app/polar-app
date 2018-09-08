import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {ISODateTimeString} from './ISODateTimeStrings';

export class Attachment extends SerializedObject {

    /**
     * The unique ID for this object.
     */
    public readonly id: string;

    /**
     * The mime type of this attachment. image/png, etc
     */
    public readonly type: string;

    /**
     * The base64 encoded data for this attachment.
     */
    public readonly data: string;

    /**
     * The time this object was created
     *
     */
    public readonly created: ISODateTimeString;

    public constructor(opts: any) {

        super(opts);

        this.id = opts.id;
        this.type = opts.type;
        this.data = opts.data;
        this.created = opts.created;

        this.init(opts);

    }


    public validate() {

        super.validate();

        Preconditions.assertPresent(this.id, "id");
        Preconditions.assertPresent(this.type, "type");
        Preconditions.assertPresent(this.data, "data");
        Preconditions.assertPresent(this.created, "created");

    }

}
