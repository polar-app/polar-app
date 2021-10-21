import {SerializedObject} from "./SerializedObject";
import {IAttachment} from "./IAttachment";
import {BackendFileRef} from "../datastore/BackendFileRef";
import {Preconditions} from "../Preconditions";

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

