/**
 * Details about a document that was loaded which can be incorporated into
 * DocInfo if necessary.
 */
import {Image} from './Image';
import {Author} from './Author';

export interface DocDetails {

    /**
     * A fingerprint for the document.
     */
    fingerprint: string;

    /**
     * The title for the document.
     */
    title?: string;

    subtitle?: string;

    description?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    url?: String;

    /**
     * The number of pages in this document.
     */
    nrPages?: number;

    thumbnail: Image;

    author?: Author;

}
