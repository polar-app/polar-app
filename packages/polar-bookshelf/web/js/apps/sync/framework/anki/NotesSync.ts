import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient, IAddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient, IFindNotesClient} from './clients/FindNotesClient';
import {SyncQueue} from '../SyncQueue';
import {Logger} from 'polar-shared/src/logger/Logger';
import {IStoreMediaFileClient, MediaFile, StoreMediaFileClient} from './clients/StoreMediaFileClient';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {MediaContents} from './MediaContents';
import {AnkiFields} from './AnkiFields';
import {CanAddNotesClient, ICanAddNotesClient} from './clients/CanAddNotesClient';
import {SyncTaskResult} from '../SyncTask';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import * as util from "util";
import {SyncEntities} from "../../../../om/SyncEntities";

const log = Logger.create();

/**
 * Performs sync of notes once we are certain the decks are created.
 */
export class NotesSync {

    public addNoteClient: IAddNoteClient = new AddNoteClient();

    public canAddNotesClient: ICanAddNotesClient = new CanAddNotesClient();

    public findNotesClient: IFindNotesClient = new FindNotesClient();

    public storeMediaFileClient: IStoreMediaFileClient = new StoreMediaFileClient();

    private readonly syncQueue: SyncQueue;

    private results: NotesSynchronized = {
        created: []
    };


    /**
     * @param syncQueue The queue to use for async operations.
     */
    constructor(syncQueue: SyncQueue) {
        this.syncQueue = syncQueue;
    }

    /**
     * Perform the actual sync of the notes to Anki.
     *
     * @param noteDescriptors The notes we need to sync.
     */
    public enqueue(noteDescriptors: ReadonlyArray<NoteDescriptor>): NotesSynchronized {

        this.syncQueue.add(async () => {
            return await this.findNotes(noteDescriptors);
        });

        return this.results;

    }

    private async findNotes(noteDescriptors: ReadonlyArray<NoteDescriptor>): Promise<Optional<SyncTaskResult>> {

        const normalizedNotes = noteDescriptors.map(current => this.normalize(current));

        normalizedNotes.forEach(normalizedNote => {

            this.syncQueue.add(async () => {
                return await this.findNote(normalizedNote);
            });

        });

        const message = `Performing sync on ${noteDescriptors.length} notes.`;

        return Optional.of({message});

    }

    private async findNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        const polarGUID = NotesSync.createPolarID(normalizedNote.noteDescriptor.guid);

        const existingIDs = await this.findNotesClient.execute(`tag:${polarGUID.format()}`);

        const syncEntity = await SyncEntities.get('anki', normalizedNote.noteDescriptor.guid);

        const hasExistingSyncEntity = syncEntity !== undefined;

        if (existingIDs.length === 0 && ! hasExistingSyncEntity) {

            // add a special tag so that users can back out polar flashcards
            // and delete them if necessary.
            normalizedNote.noteDescriptor.tags.push("_polar-flashcard");

            this.syncQueue.add(async () => await this.canAddNote(normalizedNote));

            const message = `Note not found.  Checking if we can add.`;

            log.debug(message, normalizedNote);

            return Optional.of({message});

        } else {

            // TODO: we need to implement updates ... those aren't implemented now.
            const message = 'Note already found. Skipping.';

            log.debug(message, normalizedNote);

            return Optional.of({message});
        }

    }

    private async canAddNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        const canAddNotes = await this.canAddNotesClient.execute([normalizedNote.noteDescriptor]);

        let message: string;

        this.syncQueue.add(async () => await this.addNote(normalizedNote));

        if (canAddNotes.length > 0 && canAddNotes[0]) {
            message = 'Note can be added';
        } else {
            message = 'Note already exists';
        }

        log.debug(message, normalizedNote);
        return Optional.of({message});

    }

    private async storeMediaFile(mediaFile: MediaFile): Promise<Optional<SyncTaskResult>>  {
        await this.storeMediaFileClient.execute(mediaFile.filename, mediaFile.data);
        return Optional.of({message: `Sync'd media file: ${mediaFile.filename}`});
    }

    private async addNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        let message = `Added note and ${normalizedNote.mediaFiles.length} media files.`;

        try {

            normalizedNote.mediaFiles.forEach(current => {
                this.syncQueue.add(async () => this.storeMediaFile(current));
            });

            const createdID = await this.addNoteClient.execute(normalizedNote.noteDescriptor);

            // now add this as a sync entity mapping the source and target so that we don't double
            // write it
            await SyncEntities.set('anki', normalizedNote.noteDescriptor.guid, `${createdID}`);

            this.results.created.push(normalizedNote.noteDescriptor);

        } catch (err) {
            message = "Failed to create note: " + this.pp(normalizedNote.noteDescriptor);
            log.warn(message, err);
            return Optional.of({message, failed: true});
        }

        return Optional.of({message});

    }

    private pp(noteDescriptor: NoteDescriptor) {
        return util.inspect(noteDescriptor, false, undefined, false);
    }

    private normalize(noteDescriptor: NoteDescriptor): NormalizedNote {

        const mediaFiles: MediaFile[] = [];
        let fields: {[name: string]: string} = {};

        Dictionaries.forDict(noteDescriptor.fields, (key, value) => {
            const mediaContent = MediaContents.parse(value);
            fields[key] = mediaContent.content;
            mediaFiles.push(...mediaContent.mediaFiles);
        });

        fields = AnkiFields.normalize(fields);

        const normalizedNoteDescriptor: NoteDescriptor = {
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

    public static createPolarID(guid: string): Tag {
        return new Tag('polar_guid', guid);
    }

}

/**
 * A NoteDescriptor container which includes the normalize descriptor and also
 * the media.
 */
export interface NormalizedNote {

    readonly noteDescriptor: NoteDescriptor;

    readonly mediaFiles: MediaFile[];

}

export interface ITag {

    readonly name: string;

    readonly value: string;

}

export class Tag implements ITag {

    public readonly name: string;
    public readonly value: string;

    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }

    public format(): string {
        return `${this.name}:${this.value}`;
    }

}

export interface NotesSynchronized {

    readonly created: NoteDescriptor[];

}
