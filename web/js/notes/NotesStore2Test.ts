import {MockNotes} from "../../../apps/stories/impl/MockNotes";
import {NotesStore} from "./NotesStore2";
import {assertJSON} from "../test/Assertions";

describe('NotesStore2', function() {

    it("basic", async function() {

        const notes = MockNotes.create();
        const store = new NotesStore();
        store.doPut(notes);

        assertJSON(Object.keys(store.index), [
            "100",
            "102",
            "103",
            "104",
            "105",
            "106",
            "107",
            "108",
            "109",
            "110",
            "111"
        ]);

        assertJSON(Object.keys(store.indexByName), [
            "World War II",
            "Russia",
            "Canada",
            "Germany"
        ]);

    });

});

