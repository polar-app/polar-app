const {Objects} = require("../../../util/Objects");

class PagingCursor {

    /**
     *
     * @param initialState {PagingState}
     */
    constructor(initialState, pagingBrowser, opts) {
        this.initialState = initialState;
        this.pagingBrowser = pagingBrowser;

        opts = Objects.defaults(opts, {
            expiration: 5 * 1000
        });

        this.expires = new Date().getMilliseconds() + opts.expiration;

    }

    /**
     * Return a an object with result: true if we should scroll to the next
     * page. There may be a number of reasons we should or should not scroll to
     * the next page including:
     *
     * - the page keeps expanding on us, loading too many resources.
     * - the page is locked up, and not scrolling for some reason.
     * - the page changed the URL on us loading some other content.
     * -
     */
    async scrollToNextPage() {

        let state = await this.pagingBrowser.state();

        if (new Date().getMilliseconds() > this.expires) {

            // we've been scrolling for far too long.

            return {
                result: false,
                reason: "EXPIRED"
            }

        }

        if(this.pagingBrowser.fullyPaginated(state)) {

            return {
                result: false,
                reason: "FULLY_PAGINATED"
            }

        }

        return {
            result: true
        }

    }

}

module.exports.PagingCursor = PagingCursor;
