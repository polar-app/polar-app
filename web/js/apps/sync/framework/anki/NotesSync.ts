import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient, IAddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient, IFindNotesClient} from './clients/FindNotesClient';
import {SyncQueue} from '../SyncQueue';
import {Logger} from '../../../../logger/Logger';
import {IStoreMediaFileClient, MediaFile, StoreMediaFileClient} from './clients/StoreMediaFileClient';
import {Dictionaries} from '../../../../util/Dictionaries';
import {MediaContents} from './MediaContents';

const log = Logger.create();

/**
 * Performs sync of notes once we are certain the decks are created.
 */
export class NotesSync {

    public addNoteClient: IAddNoteClient = new AddNoteClient();

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

        for (let i = 0; i < noteDescriptors.length; i++) {
            const noteDescriptor = noteDescriptors[i];

            this.syncQueue.add(async () => {
                await this.findNote(noteDescriptor);
            });

        }

        return this.results;

    }

    private async findNote(noteDescriptor: NoteDescriptor) {

        let polarGUID = NotesSync.createPolarID(noteDescriptor.guid);

        let existingIDs = await this.findNotesClient.execute(`tag:${polarGUID.format()}`);

        if(existingIDs.length === 0) {

            if(! noteDescriptor.tags.includes(polarGUID.format())) {
                //  make sure the noteDescriptor has the proper tag.
                noteDescriptor.tags.push(polarGUID.format());
            }

            this.syncQueue.add(async () => {
                await this.addNote(noteDescriptor);
            });

        }

    }

    private async addNote(noteDescriptor: NoteDescriptor) {

        try {

            // TODO: we have to convert every field to MediaContent
            //MediaContents.parse(noteDescriptor.modelName)

            let mediaFiles: MediaFile[] = [];
            let fields: {[name: string]: string} = {};

            Dictionaries.forDict(noteDescriptor.fields, (key, value) => {
                let mediaContent = MediaContents.parse(value);
                fields[key] = mediaContent.content;
                mediaFiles.push(...mediaContent.mediaFiles);
            });

            mediaFiles.forEach(mediaFile => {
                this.syncQueue.add(async () => {
                    await this.storeMediaFile(mediaFile);
                });
            });

            await this.addNoteClient.execute({
                guid: noteDescriptor.guid,
                deckName: noteDescriptor.deckName,
                modelName: noteDescriptor.modelName,
                fields,
                tags: noteDescriptor.tags
            });

        } catch (e) {
            log.error("Failed to create note: ", noteDescriptor);
            throw e;
        }

        this.results.created.push(noteDescriptor);

    }

    private async storeMediaFile(mediaFile: MediaFile) {
        await this.storeMediaFileClient.execute(mediaFile.filename, mediaFile.data);
    }

    public static createPolarID(guid: string): Tag {
        return new Tag('polar_guid', guid);
    }

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
