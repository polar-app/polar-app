import {FileRef} from "../../../datastore/Datastore";

export interface LoadDocRequest {

    readonly fingerprint: string;

    readonly fileRef: FileRef;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

}
