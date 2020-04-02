
interface FindOpts {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export interface FindController {

    // TODO: add an onResults callback which contains the number of hits, etc.

    exec(opts: FindOpts): Promise<Finder>;

}

export interface Finder {

    /**
     * Cancel the find
     */
    cancel(): void;

    /**
     * Repeat the find.
     */
    again(): void;

}
