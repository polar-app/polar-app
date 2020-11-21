export interface IMatches {
    readonly current: number;
    readonly total: number;
}


export interface IFindOptsBase {
    query: string;
    caseSensitive: boolean;
    // highlightAll: boolean;
    // findPrevious: boolean;

    /**
     * True if we should use phrase search if this is a supported feature
     * with the finder.
     */
    phraseSearch?: boolean;

}

export interface IFindOpts extends IFindOptsBase {
    onMatches: (match: IMatches) => void;
}

interface IFindFeatures {
    readonly phraseSearch: boolean;
}

export interface Finder {

    features: IFindFeatures;

    exec(opts: IFindOpts): FindHandler;

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
