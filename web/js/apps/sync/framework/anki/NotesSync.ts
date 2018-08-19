import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient, IAddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient, IFindNotesClient} from './clients/FindNotesClient';
import {SyncQueue} from '../SyncQueue';
import {Logger} from '../../../../logger/Logger';
import {IStoreMediaFileClient, MediaFile, StoreMediaFileClient} from './clients/StoreMediaFileClient';
import {Dictionaries} from '../../../../util/Dictionaries';
import {MediaContents} from './MediaContents';
import {AnkiFields} from './AnkiFields';
import {CanAddNotesClient, ICanAddNotesClient} from './clients/CanAddNotesClient';
import {SyncTaskResult} from '../SyncTask';
import {Optional} from '../../../../util/ts/Optional';

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
    enqueue(noteDescriptors: NoteDescriptor[]): NotesSynchronized {

        this.syncQueue.add(async () => {
            return await this.findNotes(noteDescriptors);
        });

        return this.results;

    }

    private async findNotes(noteDescriptors: NoteDescriptor[]): Promise<Optional<SyncTaskResult>> {

        let normalizedNotes = noteDescriptors.map(current => this.normalize(current));

        normalizedNotes.forEach(normalizedNote => {

            this.syncQueue.add(async () => {
                return await this.findNote(normalizedNote);
            });

        });

        let message = `Performing sync on ${noteDescriptors.length} notes.`;

        return Optional.of({message})

    }

    private async findNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        let polarGUID = NotesSync.createPolarID(normalizedNote.noteDescriptor.guid);

        let existingIDs = await this.findNotesClient.execute(`tag:${polarGUID.format()}`);

        if(existingIDs.length === 0) {

            if(! normalizedNote.noteDescriptor.tags.includes(polarGUID.format())) {
                //  make sure the noteDescriptor has the proper tag.
                normalizedNote.noteDescriptor.tags.push(polarGUID.format());
            }

            // FIXME: now we have to call CanAddNotesClient to see if this CAN
            // be added and if it would yield a new note.

            this.syncQueue.add(async () => await this.canAddNote(normalizedNote));

            return Optional.of({ message: `Note note found.  Checking if we can add.`});

        } else {
            return Optional.of({message: 'Note already found. Skipping.'});
        }

    }

    private async canAddNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        let canAddNotes = await this.canAddNotesClient.execute([normalizedNote.noteDescriptor]);

        if(canAddNotes.length > 0 && canAddNotes[0]) {
            this.syncQueue.add(async () => await this.addNote(normalizedNote));
            return Optional.of({message: 'Note can be added'});
        } else {
            return Optional.of({message: 'Note already exists'});
        }

    }

    private async storeMediaFile(mediaFile: MediaFile): Promise<Optional<SyncTaskResult>>  {
        await this.storeMediaFileClient.execute(mediaFile.filename, mediaFile.data);
        return Optional.of({message: `Sync'd media file: ${mediaFile.filename}`})
    }

    private async addNote(normalizedNote: NormalizedNote): Promise<Optional<SyncTaskResult>> {

        let message = `Added note and ${normalizedNote.mediaFiles.length} media files.`;

        try {

            normalizedNote.mediaFiles.forEach(current => {
                this.syncQueue.add(async () => this.storeMediaFile(current));
            });

            await this.addNoteClient.execute(normalizedNote.noteDescriptor);

            this.results.created.push(normalizedNote.noteDescriptor);

        } catch (e) {
            message = `Failed to create note: ${normalizedNote.noteDescriptor}`;
            log.error(message);
            throw e;
        }

        return Optional.of({message});

    }

    private normalize(noteDescriptor: NoteDescriptor): NormalizedNote {

        let mediaFiles: MediaFile[] = [];
        let fields: {[name: string]: string} = {};

        Dictionaries.forDict(noteDescriptor.fields, (key, value) => {
            let mediaContent = MediaContents.parse(value);
            fields[key] = mediaContent.content;
            mediaFiles.push(...mediaContent.mediaFiles);
        });

        fields = AnkiFields.normalize(fields);

        let normalizedNoteDescriptor: NoteDescriptor = {
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
