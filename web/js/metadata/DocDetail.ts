/**
 * Details about a document that was loaded which can be incorporated into
 * DocInfo if necessary.
 */
import {Image} from './Image';
import {Author} from './Author';

export interface DocDetail {

    /**
     * A fingerprint for the document.
     */
    readonly fingerprint: string;

    /**
     * The title for the document.
     */
    readonly title?: string;

    readonly subtitle?: string;

    readonly description?: string;

    /**
     * The network URL for the document where we originally fetched it.
     */
    readonly url?: String;

    /**
     * The number of pages in this document.
     */
    readonly nrPages?: number;

    readonly thumbnail?: Image;

    readonly author?: Author;

    /**
     * The progress of this document (until completion) from 0 to 100.
     *
     * By default the document is zero percent complete.
     */
    readonly progress?: number;

}
