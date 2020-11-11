"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Tag = exports.NotesSync = void 0;
const AddNoteClient_1 = require("./clients/AddNoteClient");
const FindNotesClient_1 = require("./clients/FindNotesClient");
const Logger_1 = require("polar-shared/src/logger/Logger");
const StoreMediaFileClient_1 = require("./clients/StoreMediaFileClient");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const MediaContents_1 = require("./MediaContents");
const AnkiFields_1 = require("./AnkiFields");
const CanAddNotesClient_1 = require("./clients/CanAddNotesClient");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const util = __importStar(require("util"));
const SyncEntities_1 = require("../../../../om/SyncEntities");
const log = Logger_1.Logger.create();
class NotesSync {
    constructor(syncQueue) {
        this.addNoteClient = new AddNoteClient_1.AddNoteClient();
        this.canAddNotesClient = new CanAddNotesClient_1.CanAddNotesClient();
        this.findNotesClient = new FindNotesClient_1.FindNotesClient();
        this.storeMediaFileClient = new StoreMediaFileClient_1.StoreMediaFileClient();
        this.results = {
            created: []
        };
        this.syncQueue = syncQueue;
    }
    enqueue(noteDescriptors) {
        this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
            return yield this.findNotes(noteDescriptors);
        }));
        return this.results;
    }
    findNotes(noteDescriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            const normalizedNotes = noteDescriptors.map(current => this.normalize(current));
            normalizedNotes.forEach(normalizedNote => {
                this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () {
                    return yield this.findNote(normalizedNote);
                }));
            });
            const message = `Performing sync on ${noteDescriptors.length} notes.`;
            return Optional_1.Optional.of({ message });
        });
    }
    findNote(normalizedNote) {
        return __awaiter(this, void 0, void 0, function* () {
            const polarGUID = NotesSync.createPolarID(normalizedNote.noteDescriptor.guid);
            const existingIDs = yield this.findNotesClient.execute(`tag:${polarGUID.format()}`);
            const syncEntity = yield SyncEntities_1.SyncEntities.get('anki', normalizedNote.noteDescriptor.guid);
            const hasExistingSyncEntity = syncEntity !== undefined;
            if (existingIDs.length === 0 && !hasExistingSyncEntity) {
                normalizedNote.noteDescriptor.tags.push("_polar-flashcard");
                this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () { return yield this.canAddNote(normalizedNote); }));
                const message = `Note not found.  Checking if we can add.`;
                log.debug(message, normalizedNote);
                return Optional_1.Optional.of({ message });
            }
            else {
                const message = 'Note already found. Skipping.';
                log.debug(message, normalizedNote);
                return Optional_1.Optional.of({ message });
            }
        });
    }
    canAddNote(normalizedNote) {
        return __awaiter(this, void 0, void 0, function* () {
            const canAddNotes = yield this.canAddNotesClient.execute([normalizedNote.noteDescriptor]);
            let message;
            this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () { return yield this.addNote(normalizedNote); }));
            if (canAddNotes.length > 0 && canAddNotes[0]) {
                message = 'Note can be added';
            }
            else {
                message = 'Note already exists';
            }
            log.debug(message, normalizedNote);
            return Optional_1.Optional.of({ message });
        });
    }
    storeMediaFile(mediaFile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storeMediaFileClient.execute(mediaFile.filename, mediaFile.data);
            return Optional_1.Optional.of({ message: `Sync'd media file: ${mediaFile.filename}` });
        });
    }
    addNote(normalizedNote) {
        return __awaiter(this, void 0, void 0, function* () {
            let message = `Added note and ${normalizedNote.mediaFiles.length} media files.`;
            try {
                normalizedNote.mediaFiles.forEach(current => {
                    this.syncQueue.add(() => __awaiter(this, void 0, void 0, function* () { return this.storeMediaFile(current); }));
                });
                const createdID = yield this.addNoteClient.execute(normalizedNote.noteDescriptor);
                yield SyncEntities_1.SyncEntities.set('anki', normalizedNote.noteDescriptor.guid, `${createdID}`);
                this.results.created.push(normalizedNote.noteDescriptor);
            }
            catch (err) {
                message = "Failed to create note: " + this.pp(normalizedNote.noteDescriptor);
                log.warn(message, err);
                return Optional_1.Optional.of({ message, failed: true });
            }
            return Optional_1.Optional.of({ message });
        });
    }
    pp(noteDescriptor) {
        return util.inspect(noteDescriptor, false, undefined, false);
    }
    normalize(noteDescriptor) {
        const mediaFiles = [];
        let fields = {};
        Dictionaries_1.Dictionaries.forDict(noteDescriptor.fields, (key, value) => {
            const mediaContent = MediaContents_1.MediaContents.parse(value);
            fields[key] = mediaContent.content;
            mediaFiles.push(...mediaContent.mediaFiles);
        });
        fields = AnkiFields_1.AnkiFields.normalize(fields);
        const normalizedNoteDescriptor = {
            guid: noteDescriptor.guid,
            deckName: noteDescriptor.deckName,
            modelName: noteDescriptor.modelName,
            fields,
            tags: noteDescriptor.tags
        };
        return {
            noteDescriptor: normalizedNoteDescriptor,
            mediaFiles
        };
    }
    static createPolarID(guid) {
        return new Tag('polar_guid', guid);
    }
}
exports.NotesSync = NotesSync;
class Tag {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    format() {
        return `${this.name}:${this.value}`;
    }
}
exports.Tag = Tag;
//# sourceMappingURL=NotesSync.js.map