export interface PageNavigator {

    /**
     * Get the current page number which also might be updated base on the
     * viewer itself for example when the user scrolls within a PDF viewer
     * when all the pages are displayed or when we jump between EPUB pages.
     */
    readonly get: () => number;

    /**
     * Set/jump to the given page.
     */
    readonly jumpToPage: (page: number) => Promise<void>;

    /**
     * The number of pages in the navigation set.
     */
    readonly count: number;

}
