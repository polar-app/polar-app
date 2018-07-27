"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestResultService_1 = require("./results/TestResultService");
class SpectronRenderer {
    static setup() {
        new TestResultService_1.TestResultService().start();
    }
}
exports.SpectronRenderer = SpectronRenderer;
//# sourceMappingURL=SpectronRenderer.js.map