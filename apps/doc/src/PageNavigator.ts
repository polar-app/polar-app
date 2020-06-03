export interface PageNavigator {

    /**
     * Get the current page number.
     */
    readonly get: () => number;

    /**
     * Set/jump to the given page.
     */
    readonly set: (page: number) => void;

    /**
     * The number of pages in the navigation set.
     */
    readonly count: number;

}
