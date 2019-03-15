import {ISODateTimeString} from "../metadata/ISODateTimeStrings";

// FIXME: do this in a namespace so not everything has to have 'search' in front of it.

export interface SearchEngine {

    /**
     * Run a search and provide a results object to allow us to iterate
     * through the results.
     *
     */
    query(searchQuery: string): Promise<SearchResults>;

}

/**
 *
 */
export interface SearchResults {

    // http://export.arxiv.org/api/query?search_query=all:electron

    /**
     * The total number of results available.
     */
    readonly total: number;

    /**
     * Gets the current search page, possibly executing the query for the first
     * time.
     */
    current(): Promise<SearchPage | undefined>;

    /**
     * Advanced the results to the next page.
     */
    next(): Promise<SearchPage | undefined>;

    /**
     * True if we have another page of results.
     */
    hasNext(): Promise<boolean>;

}

export interface SearchPage {
    readonly entries: ReadonlyArray<SearchEngine>;
}

export interface SearchEntry {
    readonly id: string;
    readonly updated: ISODateTimeString;
    readonly published: ISODateTimeString;
    readonly summary: ContentStr;
}

/**
 * Represent text or html content and includes a basic type field so we can
 * determine the difference.
 */
export interface ContentStr {

    readonly type: ContentStrType;
    readonly value: string;

}

export type ContentStrType = 'text' | 'html';

export interface Author {
    readonly displayName: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly affiliation: string;
}

export interface DocLink {
    readonly contentType: DocContentType;
    readonly href: string;
}

export type DocContentType = 'application/pdf' | 'text/html';
