"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestResultsService_1 = require("./results/TestResultsService");
var SpectronRenderer = /** @class */ (function () {
    function SpectronRenderer() {
    }
    SpectronRenderer.setup = function () {
        new TestResultsService_1.TestResultsService().start();
    };
    return SpectronRenderer;
}());
exports.SpectronRenderer = SpectronRenderer;
//# sourceMappingURL=SpectronRenderer.js.map