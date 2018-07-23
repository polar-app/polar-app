const log = require("../../logger/Logger").create();

/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
class TestResultsService {

    constructor() {

        /**
         * The current result that we have. Null means that we have no result.
         * If you need to store a null result wrap it in an object with a
         * 'value'
         *
         * @type {Object}
         */
        this.result = undefined;

        console.log("FIXME TestResultsServices: " + document.location.href);

        window.test_results = "hello";
        global.test_results = "hello";

        var test_results = "asdf";

    }

    start() {
        window.test_results = "hello";

        window.addEventListener("message", event => this.onMessageReceived(event.data), false);

    }

    onMessageReceived(event) {

        let message = event.data;

        if(message.type === "post-test-results") {

            if(! this.result) {
                this.result = message.value;
            } else {
                log.error("Existing test results already defined.: ", message.value);
            }

        }

        if(message.type === "receive-test-results") {
            log.info("Sending test results to: " + event.origin);
            event.sender.postMessage(this.result, event.origin);
        }

    }

}

module.exports.TestResultsService = TestResultsService;
