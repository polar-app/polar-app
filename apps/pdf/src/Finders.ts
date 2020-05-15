export interface IMatches {
    readonly current: number;
    readonly total: number;
}


export interface IFindOptsBase {
    query: string;
    phraseSearch: boolean;
    caseSensitive: boolean;
    highlightAll: boolean;
    findPrevious: boolean;
}

export interface IFindOpts extends IFindOptsBase {
    onMatches: (match: IMatches) => void;
}

export interface Finder {

    exec(opts: IFindOpts): Promise<FindHandler>;

}

/**
 * Manages the existing find operation so that it can be cancelled or run again
 * a second time.
 */
export interface FindHandler {

    /**
     * The query used to build this handler.
     */
    readonly opts: IFindOpts;

    /**
     * Cancel the find
     */
    readonly cancel: () => void;

    readonly next: () => void;
    readonly prev: () => void;

}
