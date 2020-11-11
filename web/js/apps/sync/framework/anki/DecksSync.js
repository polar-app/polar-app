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
exports.DecksSync = void 0;
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const CreateDeckClient_1 = require("./clients/CreateDeckClient");
const DeckNamesAndIdsClient_1 = require("./clients/DeckNamesAndIdsClient");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const log = Logger_1.Logger.create();
class DecksSync {
    constructor(syncQueue) {
        this.createDeckClient = new CreateDeckClient_1.CreateDeckClient();
        this.deckNamesAndIdsClient = new DeckNamesAndIdsClient_1.DeckNamesAndIdsClient();
        this.missingDecks = [];
        this.missingDeckDescriptors = [];
        this.syncQueue = syncQueue;
    }
    enqueue(deckDescriptors) {
        this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
            return yield this.findExistingDecks(deckDescriptors);
        }));
        this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
            return yield this.createMissingDecks();
        }));
        return this.missingDeckDescriptors;
    }
    findExistingDecks(deckDescriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Fetching existing decks for deckDescriptors: ", deckDescriptors);
            const deckNamesAndIds = yield this.deckNamesAndIdsClient.execute();
            const currentDecks = Object.keys(deckNamesAndIds);
            const expectedDecks = deckDescriptors.map(current => current.name);
            this.missingDecks.push(...SetArrays_1.SetArrays.difference(expectedDecks, currentDecks));
            const message = `Found ${this.missingDecks.length} missing decks from a total of ${currentDecks.length}`;
            log.info(message);
            this.missingDeckDescriptors.push(...this.missingDecks.map(name => ({ name })));
            return Optional_1.Optional.of({ message });
        });
    }
    createMissingDecks() {
        return __awaiter(this, void 0, void 0, function* () {
            this.missingDecks.forEach(missingDeck => {
                this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                    return yield this.createMissingDeck(missingDeck);
                }));
            });
            const message = `Creating ${this.missingDecks.length} decks.`;
            return Optional_1.Optional.of({ message });
        });
    }
    createMissingDeck(missingDeck) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Creating missing deck: ${missingDeck}`;
            log.info(message);
            yield this.createDeckClient.execute(missingDeck);
            return Optional_1.Optional.of({ message });
        });
    }
}
exports.DecksSync = DecksSync;
//# sourceMappingURL=DecksSync.js.map