import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";

export interface LoadDocRequest {

    readonly title: string;

    readonly fingerprint: string;

    /**
     * The URL for this document.  Used for migration purposes.
     */
    readonly url: string | undefined;

    /**
     * Used for jumping to specific areas in the document upon load
     */
    readonly initialUrl?: string;

    readonly backendFileRef: BackendFileRef;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

    // TODO: extend with page and annotation parameters.

}
