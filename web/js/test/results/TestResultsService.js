"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var Logger_1 = require("../../logger/Logger");
var TestResult_1 = require("./renderer/TestResult");
var log = Logger_1.Logger.create();
/**
 * Service to keep the result of a test result within
 *
 * @RendererContext This should be run in the renderer.
 */
var TestResultsService = /** @class */ (function () {
    function TestResultsService() {
    }
    /**
     * Start the service by listening to messages posted.
     */
    TestResultsService.prototype.start = function () {
        log.info("started");
        electron_1.ipcRenderer.on('test-results', function (event, data) {
            if (data.type === "write") {
                if (!TestResult_1.TestResult.get()) {
                    if (data.result) {
                        TestResult_1.TestResult.set(data.result);
                        log.info("Received test result: ", TestResult_1.TestResult.get());
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
        });
    };
    return TestResultsService;
}());
exports.TestResultsService = TestResultsService;
//# sourceMappingURL=TestResultsService.js.map