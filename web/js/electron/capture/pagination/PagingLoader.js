
const {Logger} = require("../../../logger/Logger");

const log = Logger.create();

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
     * @param finishedCallback function
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

        this.requestsFinished = false;

        this.finished = false;

    }

    /**
     * Called when the page is fully loaded the first time.
     */
    async onLoad() {

        // paginate until the end...

        while(await this._nextPage()) {
            log.info(`Scrolled to page: ${this.pageIdx}`);
        }

        this._handleFinished();

    }

    async _nextPage() {

        let state = await this.pagingBrowser.state();

        if(this.pagingBrowser.fullyPaginated(state)) {
            log.info("Pagination is complete");
            this.pagingFinished = true;
            return false;
        }

        ++this.pageIdx;

        await this.pagingBrowser.pageDown();

        return true;

    }

    onPendingRequestsUpdate(pendingRequestsEvent) {

        this.requestsFinished = pendingRequestsEvent.pending === 0;

        this._handleFinished();

    }

    _handleFinished() {

        if(this.pagingFinished && this.requestsFinished) {

            if(this.finished) {
                log.warn("Double finish detected. (race triggering more requests?)");
                return;
            }

            this._onFinished();

            this.finished=true;

        }

    }

    /**
     * Called when we're completely finished loading the page and all
     * sub-resources.
     */
    _onFinished() {
        this.finishedCallback();
    }

}

module.exports.PagingLoader = PagingLoader;
