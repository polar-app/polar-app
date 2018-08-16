import {assertJSON} from '../../../test/Assertions';
import {NotesSync} from './NotesSync';
import {NoteDescriptor} from './NoteDescriptor';
import {AddNoteClient} from './clients/AddNoteClient';
import {FindNotesClient} from './clients/FindNotesClient';


describe('NotesSyncTest', function() {

    let notesSync = new NotesSync();

    it("basic sync", async function () {

        // ****
        // create mocks where we have no initial notes, and we allow
        // a new note to be created.
        notesSync.addNoteClient = AddNoteClient.createMock(1);
        notesSync.findNotesClient = FindNotesClient.createMock([]);

        let noteDescriptors: NoteDescriptor[] = [
            {
                guid: "101",
                deckName: "test",
                modelName: "test",
                fields: {},
                tags: []
            }
        ];

        let notesSynchronized = await notesSync.sync(noteDescriptors);

        assertJSON(notesSynchronized.created, noteDescriptors);

    });

});
