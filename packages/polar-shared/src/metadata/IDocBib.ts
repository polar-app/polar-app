import {IDocAuthor} from "./IDocAuthor";
import {IJournal} from "./IDocDetail";

export type ReadonlyArrayMap<V> = Readonly<{readonly [key: number]: V}>;

export type Month = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

/**
 * Mutable interface for bibliographic metadata on a document
 */
export interface IDocBibMutable {

    /**
     * The title for the document.
     */
    readonly title?: string;

    /**
     * Included in some versions of bibtex.
     */
    readonly shortTitle?: string;

    /**
     * The subtitle for the document.
     */
    readonly subtitle?: string;

    /**
     * The description for the document.
     */
    readonly description?: string;

    /**
     * The volume of a journal or multivolume book.
     */
    readonly volume?: string;

    readonly issn?: string;

    readonly isbn?: string;

    readonly editor?: string | ReadonlyArrayMap<string>;

    readonly address?: string;

    readonly edition?: string;

    /**
     * The DOI (document identifier) for this document.  This is either provided
     * by the user or found via metadata when adding the PDF.
     */
    readonly doi?: string;

    /**
     * The abstract or summary of the document as provided by the author of the paper.
     */
    readonly abstract?: string;

    readonly lang?: string;

    readonly journal?: string | IJournal;

    readonly month?: Month | string;

    /**
     * The year the document was published. This needs to be a string because some publishers use
     * time ranges like '1992-1994' or '1992, 1993, 1994'
     */
    readonly year?: string;

    /**
     * The PubMed ID for this document.
     */
    readonly pmid?: string;

    /**
     * The keywords that are defined by the publisher for this document.
     */
    readonly keywords?: ReadonlyArrayMap<string>;

    readonly pages?: string;

    readonly authors?: ReadonlyArrayMap<string> | ReadonlyArrayMap<IDocAuthor>;

    /**
     * The name of the publisher for this document.  This is the name of the
     * academic journal, newspaper, website, etc.
     */
    readonly publisher?: string;

    readonly copyright?: string;

}

export interface IDocBib extends Readonly<IDocBibMutable> {

}
