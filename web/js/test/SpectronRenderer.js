"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestResultService_1 = require("./results/TestResultService");
var SpectronRenderer = /** @class */ (function () {
    function SpectronRenderer() {
    }
    SpectronRenderer.setup = function () {
        new TestResultService_1.TestResultService().start();
    };
    return SpectronRenderer;
}());
exports.SpectronRenderer = SpectronRenderer;
//# sourceMappingURL=SpectronRenderer.js.map