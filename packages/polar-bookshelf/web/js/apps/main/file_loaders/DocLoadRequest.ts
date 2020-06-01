export interface DocLoadRequest {

    /**
     * The fingerprint of the document to load
     */
    readonly fingerprint: string;

    /**
     * A URL to load which is the file parameter.
     */
    readonly fileURL: string;

    /**
     * short name of the file like 'example.pdf'
     */
    readonly filename: string;

}
