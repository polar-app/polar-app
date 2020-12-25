import {MockNotes} from "../../../apps/stories/impl/MockNotes";
import {NotesStore, ReverseIndex} from "./NotesStore2";
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

    it("initial store sanity", () => {

        const store = createStore();

        assertJSON(store, {
            "_activePos": "start",
            "_expanded": {},
            "_index": {
                "100": {
                    "_content": "World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "100",
                    "_items": [],
                    "_links": [],
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "102": {
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
                },
                "103": {
                    "_content": "[Lasted](https://www.example.com) from 1939 to 1945",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "103",
                    "_items": [],
                    "_links": [],
                    "_parent": "102",
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "104": {
                    "_content": "Axis Powers: Germany, Italy, Japan",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "104",
                    "_items": [],
                    "_links": [],
                    "_parent": "102",
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "105": {
                    "_content": "Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "105",
                    "_items": [
                        "106"
                    ],
                    "_links": [
                        "109",
                        "108"
                    ],
                    "_parent": "102",
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "106": {
                    "_content": "Lead by Franklin D. Roosevelt, Winston Churchill, and Joseph Stalin ",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "106",
                    "_items": [],
                    "_links": [],
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "107": {
                    "_content": "Germany",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "107",
                    "_items": [
                        "110"
                    ],
                    "_links": [
                        "102"
                    ],
                    "_type": "named",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "108": {
                    "_content": "Russia",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "108",
                    "_items": [],
                    "_links": [],
                    "_type": "named",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "109": {
                    "_content": "Canada",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "109",
                    "_items": [
                        "111"
                    ],
                    "_links": [],
                    "_type": "named",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "110": {
                    "_content": "Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "110",
                    "_items": [],
                    "_links": [
                        "100"
                    ],
                    "_parent": "107",
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "111": {
                    "_content": "Canada is north of the United States",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "111",
                    "_items": [],
                    "_links": [],
                    "_parent": "109",
                    "_type": "item",
                    "_updated": "2012-03-02T11:38:49.321Z"
                }
            },
            "_indexByName": {
                "Canada": "109",
                "Germany": "107",
                "Russia": "108",
                "World War II": "102"
            },
            "_reverse": {
                "index": {}
            },
            "_selected": {}
        });

    });

    it("initial reverse index", async function() {

        const store = createStore();

        assertJSON(store.lookupReverse('109'), ['111']);

    });

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


    it("doDelete", () => {

        const store = createStore();

        assertJSON(store.lookupReverse('102'), [
            "103",
            "104",
            "105"
        ]);

        store.doDelete(['102']);

        assertJSON(store.lookupReverse('102'), []);

    });


    describe("ReverseIndex", () => {

        it("basic", () => {

            const index = new ReverseIndex();

            assertJSON(index, {
                "index": {}
            });

            index.add('102', '101');

            assertJSON(index.get('102'), ['101']);

            // assertJSON(index, ['101']);

            index.remove('102', '101');

            assertJSON(index.get('102'), []);

        });

    });

});

