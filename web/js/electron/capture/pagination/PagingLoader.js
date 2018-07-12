
const {Logger} = require("../../../logger/Logger");
const log = Logger.create();

/**
 * Max amount of time we should attempt to load this page.
 *
 * @type {number}
 */
const TIMEOUT = 5000;

/**
 * Many modern pages need to be paginated to be fully loaded.  They do this
 * for performance reasons because many people never read past the first page
 * and this allows them to skip loading iframes that aren't shown.  We need
 * these though so we should paginate through the page until it's fully
 * rendered.
 *
 * This class needs to be wired up to two events. the onLoad handler for the
 * page when it has finished loading and all the {PendingWebRequestsListener}
 * so that we can get a stream of the pending web request count as they are
 * loading.
 *
 */
class PagingLoader {

    /**
     *
     * @param pagingBrowser {PagingBrowser}
     * @param finishedCallback {Function}
     */
    constructor(pagingBrowser, finishedCallback) {

        this.pagingBrowser = pagingBrowser;
        this.finishedCallback = finishedCallback;

        // the page index while we are paginating for debug purposes.
        this.pageIdx = 0;

        // the paging loader is only finished when both pagingFinished is true
        // and requestsFinished and we need to check from onLoad and via the
        // paging listener

        this.pagingFinished = false;

        // whether requests have finished. We should call this after the main
        // page load which means that all requests have been properly loaded.
        // we might have to re-think think in the future because it might be
        // more ideal to have it paired with the entire loading lifecycle.
        this.requestsFinished = false;

        this.finished = false;

        /**
         * The cursor we're going to use to page through results.
         *
         * @type {PagingCursor}
         */
        this.cursor = null;

        this.expired = false;

    }

    /**
     * Called when the page is fully loaded the first time.
     */
    async onLoad() {

        log.info("Paging loader started... ");

        await this.init();

        setTimeout(() => {

            this.expired = true;
            this._handleFinished();

        }, TIMEOUT);

        while(await this._nextPage()) {
            log.info(`Scrolled to page: ${this.pageIdx}`);
        }

        this._handleFinished();

    }

    async init() {
        this.cursor = await this.pagingBrowser.getCursor({ timeout: TIMEOUT });
    }

    async _nextPage() {

        let scrollState = await this.cursor.shouldScroll();

        if(! scrollState.result) {
            log.info("Pagination is complete. Scroll state was: ", scrollState);
            this.pagingFinished = true;
            return false;
        }

        ++this.pageIdx;

        await this.pagingBrowser.pageDown();

        return true;

    }

    onPendingRequestsUpdate(pendingRequestsEvent) {

        this.requestsFinished = pendingRequestsEvent.pending === 0;

        log.debug(`${pendingRequestsEvent.pending} pending requests remain.`);
        log.info(`requestsFinished is now: ${this.requestsFinished}`);

        this._handleFinished();

    }

    _handleFinished() {

        if(this.expired && ! this.finished) {
            log.warn("Page timeout. Finishing up manually.");
            this._finish("expired");
            return;
        }

        if(this.pagingFinished && this.requestsFinished) {
            this._finish("paging+requests");
            return;
        }

    }

    _finish(reason) {

        console.log("Paging finished: " + reason);

        if(this.finished) {
            log.warn("Double finish detected. (race triggering more requests?): " + reason);
            return;
        }

        this._onFinished();

        this.finished=true;

    }

    /**
     * Called when we're completely finished loading the page and all
     * sub-resources.
     */
    _onFinished() {

        console.log("Page loader is now finished");

        this.finishedCallback();

    }

}

module.exports.PagingLoader = PagingLoader;
