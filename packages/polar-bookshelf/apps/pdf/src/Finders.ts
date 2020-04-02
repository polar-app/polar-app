
export interface FindOpts {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export interface Finder {

    exec(opts: FindOpts): Promise<FindManager>;

}

/**
 * Manages the existing find operation.
 */
export interface FindManager {

    /**
     * Cancel the find
     */
    cancel(): void;

    /**
     * Repeat the find.
     */
    again(): void;

}
