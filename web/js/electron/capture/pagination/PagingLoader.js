/**
 * Many modern pages need to be paginated to be fully loaded.  They do this
 * for performance reasons because many people never read past the first page
 * and this allows them to skip loading iframes that aren't shown.  We need
 * these though so we should paginate through the page until it's fully
 * rendered.
 */
class PagingLoader {

    constructor(pagingBrowser) {
        this.pagingBrowser = pagingBrowser;
    }

    /**
     * Called when the page is fully loaded the first time.
     */
    onLoad() {

        // TODO: get the initial scroll height.

    }

    /**
     * Called when the page is fully loaded.
     *
     * - we have gone through all necessary pages (or hit the cap)
     * - all resources have loaded
     *
     */
    onFullyLoaded() {

    }

    /**
     * Called every time web requests have completed.  This is necessary to
     * decide if we need to keep paginating forward.
     */
    onWebRequestsCompleted() {

        // see if we've paged down properly

    }

    /**
     * Trigger the browser window to page down.
     */
    doPageDown() {

    }

    /**
     * Called when we're completely finished loading the page.
     */
    onPagingFinished() {

    }

}

module.exports.PagingLoader = PagingLoader;
