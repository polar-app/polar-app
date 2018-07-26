"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Logger_1 = require("../../logger/Logger");
var log = Logger_1.Logger.create();
/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
var TestResultsService = /** @class */ (function () {
    function TestResultsService() {
        /**
         * The current result that we have. Null means that we have no result.
         * If you need to store a null result wrap it in an object with a
         * 'value'
         */
        this.result = null;
    }
    /**
     * Start the service by listening to messages posted.
     */
    TestResultsService.prototype.start = function () {
        var _this = this;
        log.info("started");
        electron_1.ipcRenderer.on('test-results', function (event, data) {
            if (data.type === "write") {
                if (!_this.result) {
                    if (data.result) {
                        _this.result = data.result;
                        log.info("Received test result: ", _this.result);
                    }
                    else if (data.err) {
                    }
                    else {
                        log.error("Given neither result nor err: ", data);
                    }
                }
                else {
                    // TODO consider telling the sender.
                    log.error("Existing test results already defined.: ", data.value);
                }
            }
            if (data.type === "read") {
                event.sender.sendAsync();
            }
        });
    };
    return TestResultsService;
}());
exports.TestResultsService = TestResultsService;
//# sourceMappingURL=TestResultsService.js.map