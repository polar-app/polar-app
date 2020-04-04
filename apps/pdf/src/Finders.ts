
export interface FindOpts {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export interface Finder {

    exec(opts: FindOpts): Promise<FindHandler>;

}

/**
 * Manages the existing find operation so that it can be cancelled or run again
 * a second time.
 */
export interface FindHandler {

    /**
     * Cancel the find
     */
    cancel(): void;

    /**
     * Repeat the find.
     */
    again(): void;

}
