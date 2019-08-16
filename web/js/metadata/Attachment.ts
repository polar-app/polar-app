import {SerializedObject} from './SerializedObject';
import {Preconditions} from '../Preconditions';
import {BackendFileRef} from '../datastore/Datastore';
import {IAttachment} from "./IAttachment";

export class Attachment extends SerializedObject implements IAttachment {

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

