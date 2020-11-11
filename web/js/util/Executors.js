"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executors = void 0;
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Functions_1 = require("polar-shared/src/util/Functions");
class Executors {
    static runPeriodically(opts, handler) {
        let iter = 0;
        const maxIterations = Preconditions_1.defaultValue(opts.maxIterations, Number.MAX_VALUE);
        const onCompletion = Preconditions_1.defaultValue(opts.onCompletion, Functions_1.NULL_FUNCTION);
        const scheduleNextUpdate = (interval) => {
            const intervalMS = TimeDurations_1.TimeDurations.toMillis(interval);
            setTimeout(() => {
                doExecute();
            }, intervalMS);
        };
        const doExecute = () => {
            try {
                handler();
            }
            finally {
                ++iter;
                if (iter < maxIterations) {
                    scheduleNextUpdate(opts.interval);
                }
                else {
                    onCompletion();
                }
            }
        };
        if (opts.initialDelay !== undefined) {
            scheduleNextUpdate(opts.initialDelay);
        }
        else {
            doExecute();
        }
    }
}
exports.Executors = Executors;
//# sourceMappingURL=Executors.js.map