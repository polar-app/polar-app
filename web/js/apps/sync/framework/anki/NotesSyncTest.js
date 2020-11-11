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
const Assertions_1 = require("../../../../test/Assertions");
const NotesSync_1 = require("./NotesSync");
const AddNoteClient_1 = require("./clients/AddNoteClient");
const FindNotesClient_1 = require("./clients/FindNotesClient");
const SyncQueue_1 = require("../SyncQueue");
const StoreMediaFileClient_1 = require("./clients/StoreMediaFileClient");
const CanAddNotesClient_1 = require("./clients/CanAddNotesClient");
describe('NotesSync', function () {
    let notesSync;
    let abortable;
    let syncProgress;
    const syncProgressListener = _syncProgress => {
        console.log(syncProgress);
        syncProgress = _syncProgress;
    };
    let syncQueue;
    beforeEach(function () {
        abortable = {
            aborted: false
        };
        syncQueue = new SyncQueue_1.SyncQueue(abortable, syncProgressListener);
        notesSync = new NotesSync_1.NotesSync(syncQueue);
    });
    it("full initial sync", function () {
        return __awaiter(this, void 0, void 0, function* () {
            notesSync.addNoteClient = AddNoteClient_1.AddNoteClient.createMock(1);
            notesSync.canAddNotesClient = CanAddNotesClient_1.CanAddNotesClient.createMock([true]);
            notesSync.storeMediaFileClient = StoreMediaFileClient_1.StoreMediaFileClient.createMock();
            notesSync.findNotesClient = FindNotesClient_1.FindNotesClient.createMock([]);
            const noteDescriptors = [
                {
                    guid: "101",
                    deckName: "test",
                    modelName: "test",
                    fields: {},
                    tags: []
                }
            ];
            const notesSynchronized = notesSync.enqueue(noteDescriptors);
            yield syncQueue.execute();
            Assertions_1.assertJSON(notesSynchronized.created, noteDescriptors);
        });
    });
    it("sync with pre-existing notes that are skipped", function () {
        return __awaiter(this, void 0, void 0, function* () {
            notesSync.addNoteClient = AddNoteClient_1.AddNoteClient.createMock(1);
            notesSync.findNotesClient = FindNotesClient_1.FindNotesClient.createMock([1]);
            const noteDescriptors = [
                {
                    guid: "101",
                    deckName: "test",
                    modelName: "test",
                    fields: {},
                    tags: []
                }
            ];
            const notesSynchronized = notesSync.enqueue(noteDescriptors);
            yield syncQueue.execute();
            Assertions_1.assertJSON(notesSynchronized.created, []);
        });
    });
});
//# sourceMappingURL=NotesSyncTest.js.map