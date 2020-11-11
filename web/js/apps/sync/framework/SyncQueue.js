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
exports.SyncQueue = void 0;
const SyncState_1 = require("./SyncState");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Percentages_1 = require("polar-shared/src/util/Percentages");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const log = Logger_1.Logger.create();
class SyncQueue {
    constructor(abortable, syncProgressListener) {
        this.pending = [];
        this.total = 0;
        this.syncProgress = {
            percentage: 0,
            state: SyncState_1.SyncState.STARTED,
            error: undefined,
            taskResult: Optional_1.Optional.empty()
        };
        this.abortable = abortable;
        this.syncProgressListener = syncProgressListener;
    }
    add(...task) {
        this.pending.push(...task);
        ++this.total;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let syncTask;
            let idx = 0;
            while ((syncTask = this.pending.shift()) !== undefined) {
                if (this.abortable.aborted) {
                    log.info("Aborting sync.");
                    return;
                }
                try {
                    this.syncProgress.taskResult = yield syncTask();
                }
                catch (e) {
                    this.syncProgress.error = e;
                    this.syncProgress.state = SyncState_1.SyncState.FAILED;
                    this.fireSyncProgress();
                    break;
                }
                ++idx;
                this.syncProgress.percentage = Percentages_1.Percentages.calculate(idx, this.total);
                this.fireSyncProgress();
            }
        });
    }
    size() {
        return this.pending.length;
    }
    fireSyncProgress() {
        if (this.syncProgress.percentage === 100) {
            this.syncProgress.state = SyncState_1.SyncState.COMPLETED;
        }
        this.syncProgressListener(Object.freeze(Object.assign({}, this.syncProgress)));
    }
}
exports.SyncQueue = SyncQueue;
//# sourceMappingURL=SyncQueue.js.map