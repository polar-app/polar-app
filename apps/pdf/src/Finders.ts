interface Match {
    readonly current: number;
    readonly total: number;
}

export interface FindOpts {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
    onMatch: (match: Match) => void;
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
     * The query used to build this handler.
     */
    readonly opts: FindOpts;

    /**
     * Cancel the find
     */
    readonly cancel: () => void;

    readonly next: () => void;
    readonly prev: () => void;

}
