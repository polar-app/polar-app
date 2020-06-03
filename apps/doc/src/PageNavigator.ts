export interface PageNavigator {

    /**
     * Set/jump to the given page.
     */
    readonly set: (page: number) => void;

    /**
     * The number of pages in the navigation set.
     */
    readonly count: number;

}
