"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Time {
    static sleep(interval) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, interval);
        });
    }
}
exports.Time = Time;
//# sourceMappingURL=Time.js.map