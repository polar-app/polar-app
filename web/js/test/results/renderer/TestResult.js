"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResult = void 0;
class TestResult {
    static set(value) {
        window.SPECTRON_TEST_RESULT = value;
    }
    static get() {
        return window.SPECTRON_TEST_RESULT;
    }
}
exports.TestResult = TestResult;
//# sourceMappingURL=TestResult.js.map