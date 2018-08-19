/**
 * Details about a document that was loaded which can be incorporated into
 * DocInfo if necessary.
 */
export interface DocDetails {

    /**
     * The title for the document.
     */
    title?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    url?: String;

    /**
     * The number of pages in this document.
     */
    nrPages?: number;

    /**
     * A fingerprint for the document created from PDF.js
     */
    fingerprint?: string;

}
