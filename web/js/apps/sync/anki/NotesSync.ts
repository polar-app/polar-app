import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient, IAddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient, IFindNotesClient} from './clients/FindNotesClient';

/**
 * Performs sync of notes once we are certain the decks are created.
 */
export class NotesSync {

    public addNoteClient: IAddNoteClient = new AddNoteClient();

    public findNotesClient: IFindNotesClient = new FindNotesClient();

    /**
     * Perform the actual sync of the notes to Anki.
     *
     * @param noteDescriptors The notes we need to sync.
     */
    async sync(noteDescriptors: NoteDescriptor[]): Promise<NotesSynchronized> {

        let result: NotesSynchronized = {
            created: []
        };

        for (let i = 0; i < noteDescriptors.length; i++) {
            const noteDescriptor = noteDescriptors[i];

            let polarGUID = NotesSync.createPolarID(noteDescriptor.guid);

            let existingIDs = await this.findNotesClient.execute(`tag:${polarGUID.format()}`);

            if(existingIDs.length == 0) {

                if(! noteDescriptor.tags.includes(polarGUID.format())) {
                    //  make sure the noteDescriptor has the proper tag.
                    noteDescriptor.tags.push(polarGUID.format());
                }

                await this.addNoteClient.execute(noteDescriptor);

                result.created.push(noteDescriptor);

            }

        }

        return result;

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
