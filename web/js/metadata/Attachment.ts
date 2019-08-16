import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {BackendFileRef} from '../datastore/Datastore';

export class Attachment extends SerializedObject implements IAttachment {

    /**
     * The data for this attachment as stored as a file ref.
     */
    public readonly fileRef: BackendFileRef;

    public constructor(opts: any) {

        super(opts);

        this.fileRef = opts.fileRef;

        this.init(opts);

    }


    public validate() {

        super.validate();

        Preconditions.assertPresent(this.fileRef, "data");

    }

}

export interface IAttachment {
    readonly fileRef: BackendFileRef;
}

