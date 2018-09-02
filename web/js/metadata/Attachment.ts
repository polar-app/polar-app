import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {ISODateTime} from './ISODateTime';

export class Attachment extends SerializedObject {

    /**
     * The unique ID for this object.
     */
    public id: string;

    /**
     * The mime type of this attachment. image/png, etc
     */
    public type: string;

    /**
     * The base64 encoded data for this attachment.
     */
    public data: string;

    /**
     * The time this object was created
     *
     */
    public created: ISODateTime;

    protected constructor(opts: any) {

        super(opts);

        this.id = opts.id;
        this.type = opts.type;
        this.data = opts.data;
        this.created = opts.created;

        this.init(opts);

    }


    validate() {

        super.validate();

        Preconditions.assertPresent(this.id, "id");
        Preconditions.assertPresent(this.type, "type");
        Preconditions.assertPresent(this.data, "data");
        Preconditions.assertPresent(this.created, "created");

    }

}
