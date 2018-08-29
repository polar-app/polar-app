export interface LoadDocRequest {

    readonly filename: string;

    readonly fingerprint: string;

    /**
     * When true load in a new window.  Should probably always be true.
     */
    readonly newWindow: boolean;

}
