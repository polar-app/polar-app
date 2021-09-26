import {BackendFileRef} from "polar-shared/src/datastore/BackendFileRef";
import {FilePaths} from "polar-shared/src/util/FilePaths";

export interface LoadDocRequestBase {

    readonly title: string;

    readonly fingerprint: string;

    /**
     * The URL for this document.  Used for migration purposes.
     */
    readonly url: string | undefined;

    /**
     * Used for jumping to specific areas in the document upon load.
     */
    readonly initialUrl?: string;

    readonly backendFileRef: BackendFileRef;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

}

export interface LoadDocRequestForEPUB extends LoadDocRequestBase {

}

export interface LoadDocRequestForPDF extends LoadDocRequestBase {

    /**
     * When given, jump to this PDF on load.
     */
    readonly page?: number;

}

export type LoadDocRequest = LoadDocRequestForPDF | LoadDocRequestForEPUB;

export function isLoadDocRequestForPDF(req: LoadDocRequestBase): req is LoadDocRequestForPDF {

    const {backendFileRef} = req;

    const fileName = backendFileRef.name;

    return FilePaths.hasExtension(fileName, "pdf");

}
