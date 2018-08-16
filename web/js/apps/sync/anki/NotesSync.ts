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
    async sync(noteDescriptors: NoteDescriptor[]) {

        await noteDescriptors.forEach(async noteDescriptor => {

            let polarID = NotesSync.createPolarID(noteDescriptor.guid);

            let existingIDs = await this.findNotesClient.execute(`${polarID.name}:${polarID.value}`);

            if(existingIDs.length == 0) {
                await this.addNoteClient.execute(noteDescriptor);
            }

        });

    }

    public static createPolarID(guid: string): Tag {

        return {name: 'polar_guid', value: guid}

    }

}
export interface Tag {
    readonly name: string;
    readonly value: string;
}
