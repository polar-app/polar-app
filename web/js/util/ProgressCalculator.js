"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCalculator = void 0;
class ProgressCalculator {
    constructor(total, initial = 0) {
        this._value = 0;
        this._value = initial;
        this._total = total;
    }
    incr() {
        ++this._value;
    }
    value() {
        return this._value;
    }
    total() {
        return this._total;
    }
    percentage() {
        if (this._total === 0) {
            return 100;
        }
        return 100 * (this._value / this._total);
    }
    static calculate(count, total, defaultValue = 0) {
        if (total === 0) {
            return defaultValue;
        }
        return 100 * (count / total);
    }
}
exports.ProgressCalculator = ProgressCalculator;
//# sourceMappingURL=ProgressCalculator.js.map