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
exports.StartedAnkiSyncJob = exports.PendingAnkiSyncJob = void 0;
const DecksSync_1 = require("./DecksSync");
const SyncQueue_1 = require("../SyncQueue");
const NotesSync_1 = require("./NotesSync");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class AnkiSyncJob {
    constructor(syncProgressListener, deckDescriptors, noteDescriptors) {
        this.syncProgressListener = syncProgressListener;
        this.deckDescriptors = deckDescriptors;
        this.noteDescriptors = noteDescriptors;
    }
}
class PendingAnkiSyncJob extends AnkiSyncJob {
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const startedAnkiSyncJob = new StartedAnkiSyncJob(this.syncProgressListener, this.deckDescriptors, this.noteDescriptors);
            return startedAnkiSyncJob.run();
        });
    }
}
exports.PendingAnkiSyncJob = PendingAnkiSyncJob;
class StartedAnkiSyncJob extends AnkiSyncJob {
    constructor() {
        super(...arguments);
        this.aborted = false;
    }
    abort() {
        this.aborted = true;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const syncQueue = new SyncQueue_1.SyncQueue(this, this.syncProgressListener);
            const decksSync = new DecksSync_1.DecksSync(syncQueue);
            log.info("Starting anki sync job with deckDescriptors: ", this.deckDescriptors);
            decksSync.enqueue(this.deckDescriptors);
            const notesSync = new NotesSync_1.NotesSync(syncQueue);
            notesSync.enqueue(this.noteDescriptors);
            yield syncQueue.execute();
            return this;
        });
    }
}
exports.StartedAnkiSyncJob = StartedAnkiSyncJob;
//# sourceMappingURL=AnkiSyncJob.js.map