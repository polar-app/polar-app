import {MockNotes} from "../../../apps/stories/impl/MockNotes";
import {NotesStore} from "./NotesStore2";
import {assertJSON} from "../test/Assertions";
import {Arrays} from "polar-shared/src/util/Arrays";
import {TestingTime} from "polar-shared/src/test/TestingTime";

describe('NotesStore2', function() {

    beforeEach(() => {
        TestingTime.freeze()
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    function createStore() {
        const notes = MockNotes.create();
        const store = new NotesStore();
        store.doPut(notes);
        return store;
    }

    it("basic", async function() {

        const store = createStore();

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

        assertJSON(Arrays.first(Object.values(store.index)), {
            "_content": "World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.",
            "_created": "2012-03-02T11:38:49.321Z",
            "_id": "100",
            "_items": [],
            "_links": [],
            "_type": "item",
            "_updated": "2012-03-02T11:38:49.321Z",
        });

    });

    it("setContent", () => {
        const store = createStore();

        const note = store.getNote('102')

        assertJSON(note, {
            "_content": "World War II",
            "_created": "2012-03-02T11:38:49.321Z",
            "_id": "102",
            "_items": [
                "103",
                "104",
                "105"
            ],
            "_links": [],
            "_type": "named",
            "_updated": "2012-03-02T11:38:49.321Z"
        });

        TestingTime.forward(1000);

        note!.setContent("hello")

        assertJSON(note, {
            "_content": "hello",
            "_created": "2012-03-02T11:38:49.321Z",
            "_id": "102",
            "_items": [
                "103",
                "104",
                "105"
            ],
            "_links": [],
            "_type": "named",
            "_updated": "2012-03-02T11:38:50.321Z"
        });


    });

});

