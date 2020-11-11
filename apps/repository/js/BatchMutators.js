"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchMutators = void 0;
const ProgressMessages_1 = require("../../../web/js/ui/progress_bar/ProgressMessages");
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Functions_1 = require("polar-shared/src/util/Functions");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
var BatchMutators;
(function (BatchMutators) {
    function exec(transactions, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const refresh = opts.refresh || Functions_1.NULL_FUNCTION;
            const { dialogs } = opts;
            const id = opts.id || Hashcodes_1.Hashcodes.createRandomID();
            function createProgressReporter() {
                if (transactions.length <= 1) {
                    return {
                        incr: Functions_1.NULL_FUNCTION,
                        terminate: Functions_1.NULL_FUNCTION
                    };
                }
                const progressTracker = new ProgressTracker_1.ProgressTracker({
                    total: transactions.length,
                    id
                });
                const incr = () => {
                    const progress = progressTracker.incr();
                    ProgressMessages_1.ProgressMessages.broadcast(progress);
                };
                const terminate = () => {
                    ProgressMessages_1.ProgressMessages.broadcast(progressTracker.terminate());
                };
                return { incr, terminate };
            }
            const progressReporter = createProgressReporter();
            try {
                for (const transaction of transactions) {
                    transaction.prepare();
                    refresh();
                    yield transaction.commit();
                    refresh();
                    progressReporter.incr();
                }
                if (opts.success) {
                    dialogs.snackbar({ message: opts.success });
                }
            }
            catch (e) {
                if (opts.error) {
                    console.error(opts.error, e);
                    dialogs.snackbar({
                        message: opts.error + e.message,
                        type: 'error'
                    });
                }
            }
            progressReporter.terminate();
        });
    }
    BatchMutators.exec = exec;
})(BatchMutators = exports.BatchMutators || (exports.BatchMutators = {}));
//# sourceMappingURL=BatchMutators.js.map