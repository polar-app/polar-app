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
const DecksSync_1 = require("./DecksSync");
const Assertions_1 = require("../../../../test/Assertions");
const DeckNamesAndIdsClient_1 = require("./clients/DeckNamesAndIdsClient");
const CreateDeckClient_1 = require("./clients/CreateDeckClient");
const SyncQueue_1 = require("../SyncQueue");
describe('DecksSync', function () {
    let decksSync;
    let abortable;
    let syncProgress;
    const syncProgressListener = _syncProgress => {
        console.log(_syncProgress);
        syncProgress = _syncProgress;
    };
    let syncQueue;
    beforeEach(function () {
        abortable = {
            aborted: false
        };
        syncQueue = new SyncQueue_1.SyncQueue(abortable, syncProgressListener);
        decksSync = new DecksSync_1.DecksSync(syncQueue);
        decksSync.createDeckClient = CreateDeckClient_1.CreateDeckClient.createMock(1);
        decksSync.deckNamesAndIdsClient = DeckNamesAndIdsClient_1.DeckNamesAndIdsClient.createMock({});
    });
    it("basic sync", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const deckDescriptors = [
                {
                    name: "Test Deck"
                }
            ];
            const createdDescriptors = decksSync.enqueue(deckDescriptors);
            yield syncQueue.execute();
            Assertions_1.assertJSON(createdDescriptors, [
                {
                    "name": "Test Deck"
                }
            ]);
            Assertions_1.assertJSON(syncProgress, {
                "percentage": 100,
                "state": "COMPLETED",
                "taskResult": {
                    "value": {
                        "message": "Creating missing deck: Test Deck"
                    }
                }
            });
        });
    });
});
//# sourceMappingURL=DecksSyncTest.js.map