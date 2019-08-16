import {BackendFileRef} from "../datastore/Datastore";

export interface IAttachment {

    /**
     * The data for this attachment as stored as a file ref.
     */
    readonly fileRef: BackendFileRef;

}

