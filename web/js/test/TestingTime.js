"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tk = require('timekeeper');
const time = new Date(1330688329321);
class TestingTime {
    static freeze() {
        tk.freeze(time);
    }
}
exports.TestingTime = TestingTime;
function freeze() {
    TestingTime.freeze();
}
exports.freeze = freeze;
//# sourceMappingURL=TestingTime.js.map