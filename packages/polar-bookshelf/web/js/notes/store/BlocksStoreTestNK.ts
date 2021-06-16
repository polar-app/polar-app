import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {BlockContent, BlockIDStr, BlocksStore, IBlockContent} from "./BlocksStore";
import {assertJSON} from "../../test/Assertions";
import {Arrays} from "polar-shared/src/util/Arrays";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assert} from 'chai';
import {isObservable, isObservableProp} from 'mobx';
import {ReverseIndex} from "./ReverseIndex";
import {Block} from "./Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ConstructorOptions, JSDOM} from "jsdom";
import { NameContent } from "../content/NameContent";
import { MarkdownContent } from "../content/MarkdownContent";
import {Asserts} from "polar-shared/src/Asserts";
import assertPresent = Asserts.assertPresent;
import {UndoQueues2} from "../../undo/UndoQueues2";
import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {IBlock} from "./IBlock";
import {PositionalArrays} from "./PositionalArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {HTMLToBlocks, IBlockContentStructure} from "../HTMLToBlocks";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

function assertTextBlock(content: BlockContent): asserts content is MarkdownContent | NameContent {

    if (content.type !== 'markdown' && content.type !== 'name') {
        throw new Error("wrong type: " + content.type);
    }

}

function assertMarkdownBlock(block: Block): asserts block is Block<MarkdownContent> {
    if (block.content.type !== 'markdown') {
        throw new Error("wrong type: " + block.content.type);
    }
}

function assertBlocksEqual(block1: IBlock, block2: IBlock) {
    assert.equal(block1.id, block2.id, `${block1.id} & ${block2.id} Should have the same id`);
    assert.equal(block1.nspace, block2.nspace, `${block1.id} & ${block2.id} Should have the same namespace`);
    assert.equal(block1.uid, block2.uid, `${block1.id} & ${block2.id} Should have the same uid`);
    assert.equal(block1.parent, block2.parent, `${block1.id} & ${block2.id} Should have the same parent`);
    assert.equal(block1.created, block2.created, `${block1.id} & ${block2.id} Should have the same creation date`);
    assert.equal(block1.updated, block2.updated, `${block1.id} & ${block2.id} Should have the same update date`);
    assert.deepEqual(block1.content, block2.content, `${block1.id} & ${block2.id} Should have the same content`);
    assert.deepEqual(block1.parents, block2.parents, `${block1.id} & ${block2.id} Should have the same parents path`);
    assert.deepEqual(
        PositionalArrays.toArray(block1.items),
        PositionalArrays.toArray(block2.items),
        `${block1.id} & ${block2.id} Should have the same items`,
    );
}

function assertBlockParents(store: BlocksStore, parents: ReadonlyArray<BlockIDStr>) {
    return (blockID: BlockIDStr) =>  {
        const block = store.getBlock(blockID);
        assertPresent(block);
        assert.equal(block.parent, parents[parents.length - 1], `Block ${blockID} doesn't have the correct parent`);
        assert.deepEqual(block.parents, parents, `Block ${blockID} doesn't have the correct parents`);
        block.itemsAsArray.forEach(assertBlockParents(store, [...parents, block.id]));
    };
}

function assertBlocksStoreSnapshotsEqual(
    snapshot1: ReadonlyArray<IBlock<IBlockContent>>,
    snapshot2: ReadonlyArray<IBlock<IBlockContent>>,
) {
    const toIds = (arr: IBlock<IBlockContent>[]) =>
        arr.sort((a, b) => a.id.localeCompare(b.id)).map(block => block.id);

    assert.deepEqual(
        toIds([...snapshot1]),
        toIds([...snapshot2]),
        "Should have the same blocks"
    );

    for (let i = 0; i < snapshot1.length; i += 1) {
        const block1 = snapshot1[i];
        const block2 = snapshot2.find(block => block.id === block1.id)!;
        assertBlocksEqual(block1, block2);
    }
}

/**
 * Run the action but also undo and redo it and verify the result.  This way
 * every basic test can have an undo/redo operation test assertion too.
 */
export function createUndoRunner(blocksStore: BlocksStore,
                                 identifiers: ReadonlyArray<BlockIDStr>,
                                 action: () => void) {

    identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, identifiers)

    const before = blocksStore.createSnapshot(identifiers);

    console.log("Executing main action... ");
    action();
    console.log("Executing main action... done");

    const after = blocksStore.createSnapshot(identifiers);

    console.log("Execute undo() and verify ... ");
    blocksStore.undo();

    console.log("Verifying undo snapshot with before snapshot... ");
    assertBlocksStoreSnapshotsEqual(blocksStore.createSnapshot(identifiers), before);
    console.log("Verifying undo snapshot with before snapshot... done");

    console.log("Execute undo() and verify ... done");

    console.log("Execute redo() and verify ... ");

    blocksStore.redo();

    assertBlocksStoreSnapshotsEqual(blocksStore.createSnapshot(identifiers), after);
    console.log("Execute redo() and verify ... done");

}

describe('BlocksStore', function() {

    beforeEach(() => {
        console.log("Freezing time...");
        TestingTime.freeze()
        JSDOMParser.makeGlobal();
    });

    afterEach(() => {
        console.log("Unfreezing time...");
        TestingTime.unfreeze();
    });

    function createStore() {
        const blocks = MockBlocks.create();
        const store = new BlocksStore('1234', UndoQueues2.create({limit: 50}));
        store.doPut(blocks);
        return store;
    }

    describe("Observability", () => {

        it("BlocksStore", () => {

            const store = new BlocksStore('1234', UndoQueues2.create());

            assert.isTrue(isObservable(store));
            assert.isTrue(isObservableProp(store, 'root'));
            assert.isTrue(isObservableProp(store, 'active'));
            assert.isTrue(isObservableProp(store, 'index'));
            assert.isTrue(isObservableProp(store, 'indexByName'));
            assert.isTrue(isObservableProp(store, 'reverse'));
            assert.isTrue(isObservableProp(store, 'expanded'));
            assert.isTrue(isObservableProp(store, 'selected'));
            assert.isTrue(isObservableProp(store, 'dropTarget'));
            assert.isTrue(isObservableProp(store, 'dropSource'));

        });

        it("Block", () => {

            const block = new Block(MockBlocks.create()[0]);

            assert.isTrue(isObservable(block));
            assert.isTrue(isObservableProp(block, 'content'));
            assert.isTrue(isObservableProp(block, 'items'));
            assert.isTrue(isObservableProp(block, 'updated'));
            assert.isTrue(isObservableProp(block, 'created'));
            assert.isTrue(isObservableProp(block, 'root'));
            assert.isTrue(isObservableProp(block, 'parent'));
            assert.isTrue(isObservableProp(block, 'parents'));
            assert.isTrue(isObservableProp(block, 'nspace'));
            assert.isTrue(isObservableProp(block, 'mutation'));

            // assert.isTrue(isObservableProp(note.content.type, 'type'));

        });

    });

    it("initial store sanity", () => {

        const store = createStore();

        assertJSON(store, {
            "_expanded": {},
            "_hasSnapshot": false,
            "_index": {
                "102": {
                    "_content": {
                        "_data": "World War II",
                        "_type": "name",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "102",
                    "_items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "103": {
                    "_content": {
                        "_data": "[Lasted](https://www.example.com) from 1939 to 1945",
                        "_type": "markdown",
                        "_links": [],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "103",
                    "_items": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "104": {
                    "_content": {
                        "_data": "Axis Powers: Germany, Italy, Japan",
                        "_type": "markdown",
                        "_links": []
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "104",
                    "_items": {"1": "116"},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "105": {
                    "_content": {
                        "_data": "Allied Powers: United States, United Kingdom, [[Canada]], [[Russia]].",
                        "_type": "markdown",
                        "_links": [
                            {
                                "id": "109",
                                "text": "Canada"
                            },
                            {
                                "id": "108",
                                "text": "Russia"
                            }
                        ],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "105",
                    "_items": {
                        "1": "106"
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "102",
                    "_parents": [
                        "102"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "106": {
                    "_content": {
                        "_data": "Lead by Franklin D. Roosevelt, [[Winston Churchill]], and Joseph Stalin ",
                        "_type": "markdown",
                        "_links": [
                            {
                                "id": "112",
                                "text": "Winston Churchill"
                            }
                        ]
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "106",
                    "_items": {
                        "1": "117",
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "105",
                    "_parents": [
                        "102",
                        "105"
                    ],
                    "_root": "102",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "107": {
                    "_content": {
                        "_data": "Germany",
                        "_type": "name",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "107",
                    "_items": {
                        "1": "110"
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "107",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "108": {
                    "_content": {
                        "_data": "Russia",
                        "_type": "name",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "108",
                    "_items": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "108",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "109": {
                    "_content": {
                        "_data": "Canada",
                        "_type": "name",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "109",
                    "_items": {
                        "1": "111"
                    },
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "109",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "110": {
                    "_content": {
                        "_data": "Germany Germany (German: Deutschland, German pronunciation: [ˈdɔʏtʃlant]), officially the Federal Republic of Germany (German: Bundesrepublik Deutschland, About this soundlisten),[e] is a country in Central and Western Europe and one of the major participants of [[World War II]]",
                        "_type": "markdown",
                        "_links": [
                            {
                                "id": "102",
                                "text": "World War II"
                            }
                        ],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "110",
                    "_items": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "107",
                    "_parents": [
                        "107"
                    ],
                    "_root": "107",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "111": {
                    "_content": {
                        "_data": "Canada is north of the United States",
                        "_type": "markdown",
                        "_links": [],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "111",
                    "_items": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parent": "109",
                    "_parents": [
                        "109"
                    ],
                    "_root": "109",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "112": {
                    "_content": {
                        "_data": "Winston Churchill",
                        "_type": "name",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "112",
                    "_items": {},
                    "_mutation": 0,
                    "_nspace": "ns101",
                    "_parents": [],
                    "_root": "112",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z"
                },
                "116": {
                    "_id": '116',
                    "_nspace": "ns101",
                    "_parent": "104",
                    "_parents": ["102", "104"],
                    "_root": "102",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'markdown',
                        "_data": 'Some random markdown',
                        "_links": [],
                    },
                    "_items": {},
                    "_uid": "123",
                    "_mutation": 0,
                },
                "117": {
                    "_id": '117',
                    "_nspace": "ns101",
                    "_parent": "106",
                    "_parents": ["102", "105", "106"],
                    "_root": "102",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_uid": "123",
                    "_content": {
                        "_type": 'markdown',
                        "_data": 'Nested child with links [[Winston]]',
                        "_links": [{ id: '112', text: 'Winston' }],
                    },
                    "_items": {
                        "1": "118"
                    },
                    "_mutation": 0,
                },
                "118": {
                    "_id": '118',
                    "_nspace": "ns101",
                    "_parent": "117",
                    "_parents": ["102", "105", "106", "117"],
                    "_root": "102",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_uid": "123",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'markdown',
                        "_data": 'Deeply nested child',
                        "_links": [],
                    },
                    "_items": {},
                    "_mutation": 0,
                },
            },
            "_indexByName": {
                "Canada": "109",
                "Germany": "107",
                "Russia": "108",
                "Winston Churchill": "112",
                "World War II": "102"
            },
            "_reverse": {
                "index": {
                    "102": [
                        "110"
                    ],
                    "108": [
                        "105"
                    ],
                    "109": [
                        "105"
                    ],
                    "112": [
                        "106",
                        "117",
                    ],
                }
            },
            "_selected": {},
            "uid": "1234",
            "undoQueue": {
                "limit": 50
            }
        });

    });

    it('should not have corrupted data', () => {
        const store = createStore();
        const rootBlocks = Object.keys(store.index)
            .map(id => store.getBlock(id)!)
            .filter(block => !block.parent);

        rootBlocks.map(block => block.id).forEach(assertBlockParents(store, []));
    });

    it("initial reverse index", async function() {

        const store = createStore();

        assertJSON(store.lookupReverse('109'), ['105']);

    });

    describe("lookupReverse", () => {

        it("102", () => {

            const store = createStore();

            const references = store.lookupReverse('102');
            assertJSON(references, ['110']);

        });

    });

    describe("doIndent", () => {

        it("second child block", async function() {

            const store = createStore();

            assertJSON(store.getBlock('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            TestingTime.forward(1000);

            const indentResult = store.indentBlock('104')

            assertJSON(store.getBlock('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "3": "105"
                },
                "mutation": 1,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

            assertJSON(store.getBlock(indentResult[0].value!)?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945",
                    "type": "markdown",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": {
                    "1": "104"
                },
                "mutation": 1,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

            assertJSON(store.expanded, {
                "103": true
            });

        });

        it("indent node and try to indent it again to make sure it fails properly", async function() {

            const store = createStore();

            const indent0 = store.indentBlock('104');
            const indent1 = store.indentBlock('104');

            assert.equal(indent1.length, 1);

            assert.equal(indent1[0].error, 'no-sibling');

        });

        it("indent then unindent and make sure we do a full restore to the original", () => {

            const store = createStore();

            assertJSON(store.getBlock('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            assertJSON(store.getBlock('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {"1": "116"},
                "mutation": 0,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            store.indentBlock('104')

            assertJSON(store.getBlock('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {"1": "116"},
                "mutation": 1,
                "nspace": "ns101",
                "parent": "103",
                "parents": [
                    "102", "103"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assert.equal(store.getBlock('104')!.parent, '103');

            store.unIndentBlock('104');

            assertJSON(store.getBlock('104')?.toJSON(),{
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "type": "markdown",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": {"1": "116"},
                "mutation": 2,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.getBlock('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "2": "104",
                    "3": "105"
                },
                "mutation": 2,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

        });

        it("indent or a root node", () => {

            const store = createStore();

            const indentResult = store.indentBlock('108')

            assert.equal(indentResult[0].error!, 'no-parent');

        });

        it("indent the first node and fail properly", () => {
            // this should not work because there should be no previous sibling
            // to make as the new parent.

            const store = createStore();

            const indentResult = store.indentBlock('103')

            assert.equal(indentResult[0].error!, 'no-sibling');

        });

    });

    it("basic", async function() {

        const store = createStore();

        assertJSON(Object.keys(store.index), [
            "102",
            "103",
            "104",
            "105",
            "106",
            "107",
            "108",
            "109",
            "110",
            "111",
            "112",
            "116",
            "117",
            "118",
        ]);

        assertJSON(Object.keys(store.indexByName), [
            "World War II",
            "Russia",
            "Canada",
            "Germany",
            "Winston Churchill"
        ]);

        assertJSON(Arrays.first(Object.values(store.index))?.toJSON(), {
            "content": {
                "data": "World War II",
                "type": "name"
            },
            "created": "2012-03-02T11:38:49.321Z",
            "id": "102",
            "items": {
                "1": "103",
                "2": "104",
                "3": "105"
            },
            "mutation": 0,
            "nspace": "ns101",
            "parents": [],
            "root": "102",
            "uid": "123",
            "updated": "2012-03-02T11:38:49.321Z"
        });

    });

    describe("prevSibling", () => {

        it("no prev sibling", () => {
            const store = createStore()

            assert.equal(store.prevSibling('104'), '103')
        });

        it("has prev sibling", () => {
            const store = createStore()

            assert.isUndefined(store.prevSibling('103'))

        });


    });

    describe("canMergePrev", () => {

        it("mergeable", () => {

            const store = createStore()

            assertJSON(store.canMergePrev('104'), {
                "source": "104",
                "target": "103"
            });

        });

        it("unmergeable", () => {

            const store = createStore()

            assert.isUndefined(store.canMergePrev('103'));

        });
    });

    describe("setSelectionRange", () => {
        let store: BlocksStore;

        beforeEach(() => {
            store = createStore();
            store.setRoot('102');
            store.computeLinearTree('102').forEach(store.expand.bind(store));
        });

        it("should handle basic selection ranges (siblings only)", () => {
            store.setSelectionRange('103', '104');

            assert.deepEqual(store.selected, arrayStream(['103', '104']).toMap2(c => c, () => true));
        });

        it("should handle complex structures (siblings with children)", () => {
            store.setSelectionRange('103', '106');

            assert.deepEqual(store.selected, arrayStream(['103', '104', '105']).toMap2(c => c, () => true));
        });

        it("should handle bottom to top selections", () => {
            store.setSelectionRange('106', '104');

            assert.deepEqual(store.selected, arrayStream(['104', '105']).toMap2(c => c, () => true));
        });

        it("should have the correct selected items when setting the selection multiple times with a complex structure", () => {
            store.setSelectionRange('102', '104');
            store.setSelectionRange('102', '117');
            store.setSelectionRange('102', '118');

            assert.deepEqual(store.selected, arrayStream(['102']).toMap2(c => c, () => true));
        });
    });

    describe("canMergeNext", () => {
        it("should allow merging blocks in the same level", () => {
            const store = createStore();

            assertJSON(store.canMergeNext('103'), {
                "source": "104",
                "target": "103"
            });
        });

        it("should allow merging a parent with its first child", () => {
            const store = createStore();

            assertJSON(store.canMergeNext('102'), {
                "source": "103",
                "target": "102"
            });
        });

        it("shouldn't allow merging blocks that have no siblings after them", () => {
            const store = createStore();

            assert.isUndefined(store.canMergeNext('110'));
        });

        it("should allow merging a block with its parent's next sibling no matter what depth the current block is at", () => {
            const store = createStore();

            /*
                111
                    level1Block
                        level2Block <---| We should be able to merge these two
                parentNextSibling <-----|
            */

            const parentNextSibling = store.createNewBlock('111');
            Asserts.assertPresent(parentNextSibling);
            const level1Block = store.createNewBlock('111');
            Asserts.assertPresent(level1Block);
            store.indentBlock(level1Block.id);
            const level2Block = store.createNewBlock(level1Block.id)!;
            Asserts.assertPresent(level2Block);
            store.indentBlock(level2Block.id);

            assertJSON(store.canMergeNext(level2Block.id), {
                "source": parentNextSibling.id,
                "target": level2Block.id
            });
        });
    });

    describe("moveBlock", () => {
        it("should not be able to move a root block", () => {
            const store = createStore();
            const id = '102';
            const blockBefore = store.getBlock(id)!.toJSON();
            store.moveBlocks([id], -1);
            const blockAfter = store.getBlock(id)!.toJSON();
            assertBlocksEqual(blockBefore, blockAfter);
        });

        it("should not be able to move a block that's already the first child in its parent's", () => {
            const store = createStore();
            const id = '103';
            const block = store.getBlock(id);
            assertPresent(block);
            assertPresent(block.parent);
            let parent = store.getBlock(block.parent);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);
            store.moveBlocks([id], -5);
            parent = store.getBlock(block.parent);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);
        });

        it("should be able to move a block upwards/downwards", () => {
            const store = createStore();
            const id = '105';
            const block = store.getBlock(id);
            assertPresent(block);
            const parentID = block.parent;
            assertPresent(parentID);
            let parent = store.getBlock(parentID);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            // Upwards
            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks([id], -5);
                parent = store.getBlock(parentID);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['105', '103', '104']);
            });


            // Downwards
            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks([id], 1);
                parent = store.getBlock(parentID);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['103', '105', '104']);
            });
        });

        it("should be able to move multiple blocks properly (upwards)", () => {
            const store = createStore();
            const id = '102';
            const parent = store.getBlock(id);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['105', '104'], -5);
                const parent = store.getBlock(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '105', '103']);
            });

        });

        it("should be able to move multiple blocks properly (downwards)", () => {
            const store = createStore();
            const id = '102';
            const parent = store.getBlock(id);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['103', '105'], 5);
                const parent = store.getBlock(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '103', '105']);
            });

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['105', '104'], -1);
                const parent = store.getBlock(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '105', '103']);
            });
        });
    });

    describe("mergeBlocks", () => {

        it("Merge empty first child with named block root", () => {

            const store = createStore()

            const createdBlock = store.createNewBlock('102');

            assertPresent(createdBlock);

            const block = store.getBlock('102')!;

            assertJSON(block.items, {
                "0": createdBlock?.id,
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const newBlock = store.getBlock(createdBlock.id)!;

            assertTextBlock(newBlock!.content);

            assert.equal(newBlock.content.data, '');

            assert.ok(store.canMergePrev(newBlock.id));
            assert.ok(store.canMergeWithDelete(newBlock, block));

            assert.equal(store.mergeBlocks(block.id, newBlock.id), 'block-merged-with-delete');

            assertJSON(store.getBlock('102')!.items, {
                "1": "103",
                "2": "104",
                "3": "105"
            });

            assert.isUndefined(store.getBlock(createdBlock.id));

        });

        it("basic merge", () => {

            const store = createStore()

            // merge 103 and 104

            TestingTime.forward(1000);

            assert.equal(store.getBlock('103')?.mutation, 0);
            assert.equal(store.getBlock('104')?.mutation, 0);

            store.mergeBlocks('103', '104');

            assert.isUndefined(store.getBlock('104'));

            assertJSON(store.getBlock('103')?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945Axis Powers: Germany, Italy, Japan",
                    "type": "markdown",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": {"1": "116"},
                "mutation": 1,
                "nspace": "ns101",
                "parent": "102",
                "parents": [
                    "102"
                ],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

        });

        it('should handle merging 2 blocks that have children', () => {
            const store = createStore()
            const createdBlock1 = store.createNewBlock('104');
            assertPresent(createdBlock1);
            store.indentBlock(createdBlock1.id);

            const createdBlock2 = store.createNewBlock('106');
            assertPresent(createdBlock2);
            store.indentBlock(createdBlock2.id);
            const createdBlock3 = store.createNewBlock(createdBlock2.id);
            assertPresent(createdBlock3);
            store.indentBlock(createdBlock3.id);
            /*
             *   104----------------------------|-- We're merging these 2
             *       116                        |
             *       createdBlock1              |
             *   105 ---------------------------|
             *       106
             *           117
             *               118
             *           createdBlock2
             *               createdBlock3
             *
             *
             *   We should end up with
             *   104
             *       116
             *       createdBlock1
             *       106
             *           117
             *               118
             *           createdBlock2
             *                  createdBlock3
            */

            const identifiers = [
                '104',
                '105',
            ];

            createUndoRunner(store, identifiers, () => {
                store.mergeBlocks('104', '105');

                const block104 = store.getBlock('104');
                const block105 = store.getBlock('105');
                const block106 = store.getBlock('106');
                const block1 = store.getBlock(createdBlock1.id);
                const block2 = store.getBlock(createdBlock2.id);
                const block3 = store.getBlock(createdBlock3.id);

                assertPresent(block104);
                assertPresent(block106);
                assertPresent(block1);
                assertPresent(block2);
                assertPresent(block3);

                // 105 should be deleted
                assert.isUndefined(block105);

                // 104 should have the correct children
                assert.deepEqual([...block104.itemsAsArray], ['116', block1.id, '106']);

                // block1 items
                assert.deepEqual([...block1.itemsAsArray].sort(), [], 'Block1 should have the correct items');
                // 106 items
                assert.deepEqual([...block106.itemsAsArray], ['117', block2.id], 'Block106 should have the correct items');

                // block2 items
                assert.deepEqual([...block2.itemsAsArray], [block3.id], 'Block2 should have the correct items');

                // block3 items
                assert.deepEqual([...block3.itemsAsArray], [], 'Block3 should have the correct items');

                // Check parent & parents for items under 104 (recursively)
                assertBlockParents(store, ['102'])('104');
            });
        });

        it('should update the link index properly when merging blocks that have links', () => {
            const store = createStore()
            const linkBlock1 = store.createNewBlock('102');
            const linkBlock2 = store.createNewBlock('102');
            assertPresent(linkBlock1);
            assertPresent(linkBlock2);

            const createdBlock1 = store.createNewBlock('102');
            assertPresent(createdBlock1);
            store.setBlockContent(createdBlock1.id, new MarkdownContent({
                type: 'markdown',
                data: 'hello [[world]]',
                links: [
                    {id: linkBlock1.id, text: 'world'},
                ]
            }));

            const createdBlock2 = store.createNewBlock(createdBlock1.id);
            assertPresent(createdBlock2);
            store.indentBlock(createdBlock2.id);
            store.setBlockContent(createdBlock2.id, new MarkdownContent({
                type: 'markdown',
                data: 'new [[block]]',
                links: [
                    {id: linkBlock2.id, text: 'block'},
                ]
            }));

            store.mergeBlocks(createdBlock1.id, createdBlock2.id);

            const block1 = store.getBlock(createdBlock1.id);
            const block2 = store.getBlock(createdBlock2.id);

            assertPresent(block1);
            assertMarkdownBlock(block1);
            assert.isUndefined(block2);

            assert.deepEqual(block1.content.links, [
                {id: linkBlock1.id, text: 'world'},
                {id: linkBlock2.id, text: 'block'},
            ]);

            assert.deepEqual(store.reverse.get(linkBlock1.id), [block1.id]);
            assert.deepEqual(store.reverse.get(linkBlock2.id), [block1.id]);
        });
    });

    describe("Blocks", () => {

        describe("setContent", () => {

            it("reactivity", () => {
                //
                // const store = createStore();
                //
                // const block = store.getBlock('102')
                //
                // console.log("FIXME: ", block!.content);
                //
                //
                // (block!.content as any).subscribe((next: any) => console.log("FIXME next"));

            });

            it("basic", () => {

                const store = createStore();

                const block = store.getBlock('102')

                assertPresent(block);

                assertJSON(block.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "type": "name"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "mutation": 0,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

                TestingTime.forward(1000);

                block.withMutation(() => {
                    block.setContent({type: 'name', data: "World War Two"})
                })

                assertJSON(block?.toJSON(),{
                    "content": {
                        "data": "World War Two",
                        "type": "name"
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "mutation": 1,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:50.321Z"
                });

            });
        });


    });

    it("deleteBlocks", () => {

        it("basic", () => {

            const blocksStore = createStore();

            createUndoRunner(blocksStore, ['102'], () => {
                blocksStore.deleteBlocks(['102']);
            });

        });

    });

    describe("doDelete", () => {

        it("basic", () => {

            const blocksStore = createStore();

            assertJSON(blocksStore.lookupReverse('102'), [
                "110"
            ]);

            blocksStore.deleteBlocks(['102']);

            assertJSON(blocksStore.lookupReverse('102'), []);

        });

        it("delete middle block and verify active", () => {

            const store = createStore();

            store.deleteBlocks(['104']);

            const block = store.getBlock('102');

            assertJSON(block?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    "1": "103",
                    "3": "105"
                },
                "mutation": 1,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            })

            assert.equal(store.active?.id, '105');
            assert.equal(store.active?.pos, 'start');

        });

        it("delete all children", () => {

            const store = createStore();

            store.deleteBlocks(['103', '104', '105']);

            const block = store.getBlock('102');

            assertJSON(block?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name"
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {},
                "mutation": 3,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            })

            assert.equal(store.active?.id, '102');
            assert.equal(store.active?.pos, 'start');

        });


    });

    describe("getBlockByTarget", () => {

        it("By ID", () => {
            const store = createStore();
            const block = store.getBlockByTarget('102');
            assert.equal(block?.id, '102');
        });

        it("By Name", () => {

            const store = createStore();
            const block = store.getBlockByTarget('World War II');
            assert.equal(block?.id, '102');

        });

    });

    describe("pathToBlock", () => {

        it("Verify that a root block has an empty path", () => {

            const store = createStore();
            const path = store.pathToBlock('102');
            assert.equal(path.length, 0);

        });

        it("Path to level 1", () => {

            const store = createStore();
            const path = store.pathToBlock('105');
            assert.equal(path.length, 1);

            assert.equal(path[0].id, "102");

        });

        it("Path to level 2", () => {

            const store = createStore();
            const path = store.pathToBlock('106');
            assert.equal(path.length, 2);

            assert.equal(path[0].id, "102");
            assert.equal(path[1].id, "105");

        });


    });

    describe("ReverseIndex", () => {

        it("basic", () => {

            const index = new ReverseIndex();

            assertJSON(index, {
                "index": {}
            });

            index.add('102', '101');

            assertJSON(index.get('102'), ['101']);

            index.remove('102', '101');

            assertJSON(index.get('102'), []);

        });

    });

    describe("createNewBlock", () => {

        // TODO : test redo and the functions should do patches after the first redo...
        //

        it("basic undo and redo", () => {

            const blocksStore = createStore();

            const identifiers = ['102'];

            // FIXME: there's a bug here... if we restore, and EVERYTHING looks
            // the same, except the mutation, and updated, then we have to restore that
            // too... .

            createUndoRunner(blocksStore, identifiers, () => {

                const createdBlock = blocksStore.createNewBlock('102');

                assertJSON(blocksStore.getBlock('102')?.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "type": "name",
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        "0": createdBlock?.id,
                        "1": "103",
                        "2": "104",
                        "3": "105"
                    },
                    "mutation": 1,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

            })

        });

        it("undo with split", () => {

            const blocksStore = createStore();

            const identifiers = ['104'];

            createUndoRunner(blocksStore, identifiers, () => {

                const createdBlock = blocksStore.createNewBlock('104', {split: {prefix: 'Axis ', suffix: 'Powers: Germany, Italy, Japan'}});

                assertJSON(blocksStore.getBlock('104')?.toJSON(), {
                    "content": {
                        "data": "Axis ",
                        "type": "markdown",
                        "links": [],
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "104",
                    "mutation": 1,
                    "items": {},
                    "nspace": "ns101",
                    "parent": "102",
                    "parents": [
                        "102"
                    ],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

                assertJSON(blocksStore.getBlock(createdBlock!.id)?.toJSON(), {
                    "content": {
                        "data": "Powers: Germany, Italy, Japan",
                        "type": "markdown",
                        "links": [],
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": createdBlock!.id,
                    "items": {"1": "116"},
                    "mutation": 0,
                    "nspace": "ns101",
                    "parent": "102",
                    "parents": [
                        "102"
                    ],
                    "root": "102",
                    "uid": "1234",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

            });

        });

        it("Make sure first child when having existing children.", () => {

            const store = createStore();

            let block = store.getBlock('102');

            TestingTime.forward(60 * 1000);

            const now = ISODateTimeStrings.create();

            assertJSON(block!.items, {
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const createdBlock = store.createNewBlock('102');

            assertPresent(createdBlock);

            block = store.getBlock('102');

            assertJSON(block!.items, {
                "0": createdBlock.id,
                "1": "103",
                "2": "104",
                "3": "105"
            });

            const newBlock = store.getBlock(createdBlock.id)!;

            assert.equal(newBlock.created, now);
            assert.equal(newBlock.updated, now);
            assert.equal(newBlock.parent, block!.id);

            assert.equal(block!.updated, now);

            // assertJSON(store, {});

        });

        it("Add child to root node with no children", () => {

            const store = createStore();

            let block = store.getBlock('102');

            store.deleteBlocks(['103', '104', '105']);

            block = store.getBlock('102');
            assertJSON(block!.items, {});

            const createdBlock = store.createNewBlock('102');
            assertPresent(createdBlock);
            block = store.getBlock('102');

            assertJSON(block!.items, {
                "-1": createdBlock.id
            });

        });

        it("Make sure it's the child of an expanded block", () => {

            const store = createStore();

            function createBlockWithoutExpansion() {

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '102');

                const block = store.getBlock('102');

                assertJSON(block!.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": createdBlock?.id
                });

            }

            function createBlockWithExpansion() {
                store.expand('105');

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '105');

                const block = store.getBlock('105');

                assertJSON(block!.items, {
                    "0": createdBlock?.id,
                    "1": "106"
                });

            }

            createBlockWithoutExpansion();
            createBlockWithExpansion();



        });

        it("Split a block with children", () => {

            const store = createStore();

            function doFirstSplit() {

                const id = '105'

                const originalBlock = store.getBlock(id);

                assertPresent(originalBlock);

                assertMarkdownBlock(originalBlock);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});
                assertPresent(createdBlock);

                const newBlock = store.getBlock(createdBlock.id);
                assertPresent(newBlock);
                assertPresent(newBlock.parent);
                const parentBlock = store.getBlock(newBlock.parent);
                assertPresent(parentBlock);

                assertJSON(parentBlock.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": createdBlock.id
                });

                newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));

                return createdBlock.id;

            }

            function doSecondSplit(id: BlockIDStr) {

                const originalBlock = store.getBlock(id);

                assertPresent(originalBlock);
                assertMarkdownBlock(originalBlock);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});

                assertPresent(createdBlock);

                const newBlock = store.getBlock(createdBlock.id);
                assertPresent(newBlock);
                assertPresent(newBlock.parent);
                const parentBlock = store.getBlock(newBlock.parent);
                assertPresent(parentBlock);
                assertPresent(createdBlock);

                assertJSON(parentBlock.items, {
                    "1": "103",
                    "2": "104",
                    "3": "105",
                    "4": id,
                    "5": createdBlock.id
                });

                newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));
            }

            const firstSplitBlockID = doFirstSplit();

            doSecondSplit(firstSplitBlockID);

        });

        it('should properly split a block with multiple levels of nested children', () => {
            const store = createStore();
            const id = '105';
            const originalBlock = store.getBlock(id);

            assertPresent(originalBlock);
            assertMarkdownBlock(originalBlock);

            const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});

            assertPresent(createdBlock);

            const newBlock = store.getBlock(createdBlock.id);
            assertPresent(newBlock);
            assertPresent(newBlock.parent);
            const parentBlock = store.getBlock(newBlock.parent);
            assertPresent(parentBlock);
            assertPresent(createdBlock);

            assertJSON(parentBlock.items, {
                "1": "103",
                "2": "104",
                "3": "105",
                "4": createdBlock.id
            });

            newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));
        });

        it("should create a new child in a block with children (when suffix is empty)", () => {
            const store = createStore();

            const id = '105';

            let originalBlock = store.getBlock(id);

            assertPresent(originalBlock);

            assertTextBlock(originalBlock.content);

            const createdBlock = store.createNewBlock(id, {split: {prefix: originalBlock.content.data, suffix: ''}});
            assertPresent(createdBlock);

            originalBlock = store.getBlock(id);

            assertPresent(originalBlock);

            assert.deepEqual(originalBlock.itemsAsArray, [
                createdBlock.id,
                '106'
            ]);

            const newBlock = store.getBlock(createdBlock.id);
            assertPresent(newBlock);

            assert.equal(newBlock.parent, id);
            assert.deepEqual(newBlock.parents, [...originalBlock.parents, id]);
        });

        it("should create a new child in the refed block (when the asChild option is true)", () => {
            const store = createStore();

            const id = '105';

            let originalBlock = store.getBlock(id);

            assertPresent(originalBlock);

            assertTextBlock(originalBlock.content);

            const createdBlock = store.createNewBlock(id, {asChild: true});
            assertPresent(createdBlock);

            originalBlock = store.getBlock(id);

            assertPresent(originalBlock);

            assert.deepEqual(originalBlock.itemsAsArray, [
                createdBlock.id,
                '106'
            ]);

            const newBlock = store.getBlock(createdBlock.id);
            assertPresent(newBlock);

            assert.equal(newBlock.parent, id);
            assert.deepEqual(newBlock.parents, [...originalBlock.parents, id]);
        });
    });

    describe("blocksToBlockContentStructure", () => {
        it("should convert the ids of blocks (including their children) to a content structure", () => {
            const store = createStore();

            const output = store.createBlockContentStructure(['102']);

            const block102 = store.getBlock('102');
            const block103 = store.getBlock('103');
            const block104 = store.getBlock('104');
            const block116 = store.getBlock('116');
            const block105 = store.getBlock('105');
            const block106 = store.getBlock('106');
            const block117 = store.getBlock('117');
            const block118 = store.getBlock('118');

            assertPresent(block102);
            assertPresent(block103);
            assertPresent(block104);
            assertPresent(block116);
            assertPresent(block105);
            assertPresent(block106);
            assertPresent(block117);
            assertPresent(block118);
            assertMarkdownBlock(block103);
            assertMarkdownBlock(block104);
            assertMarkdownBlock(block116);
            assertMarkdownBlock(block105);
            assertMarkdownBlock(block106);
            assertMarkdownBlock(block117);
            assertMarkdownBlock(block118);

            const expected = [
                {
                    content: block102.content.toJSON(),
                    children: [
                        {content: block103.content.toJSON(), children: []},
                        {
                            content: block104.content.toJSON(),
                            children: [
                                {content: block116.content.toJSON(), children: []}
                            ]
                        },
                        {
                            content: block105.content.toJSON(),
                            children: [
                                {
                                    content: block106.content.toJSON(),
                                    children: [
                                        {
                                            content: block117.content.toJSON(),
                                            children: [
                                                {content: block118.content.toJSON(), children: []},
                                            ]
                                        },
                                    ]
                                }
                            ]
                        },
                        
                    ]
                },
            ];
            
            assert.deepEqual(output, expected);
        });
    });

    describe("insertFromBlockContentStructure", () => {
        it("should insert a block structure properly", () => {
            const blockStructure: ReadonlyArray<IBlockContentStructure> = [
                {content: HTMLToBlocks.createMarkdownContent("item1"), children: []},
                {
                    content: HTMLToBlocks.createMarkdownContent("item2"),
                    children: [
                        {content: HTMLToBlocks.createMarkdownContent("hmm"), children: []},
                        {
                            content: HTMLToBlocks.createMarkdownContent("world"),
                            children: [
                                {content: HTMLToBlocks.createMarkdownContent("potato"), children: []},
                            ]
                        },
                    ]
                },
                {content: HTMLToBlocks.createMarkdownContent("item3"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Test bold italics linethrough underline"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("What is going on right now"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Hello"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("World"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("Foo"), children: []},
                {content: HTMLToBlocks.createMarkdownContent("bar"), children: []},
            ];

            const store = createStore();
            const id = '112';

            store.setRoot(id);
            store.setActive(id);
            const blockIDs = Array.from({ length: 12 }).map(() => Hashcodes.createRandomID());

            createUndoRunner(store, ['112', ...blockIDs], () => {
                store.insertFromBlockContentStructure(blockStructure, {blockIDs});
                const block102 = store.getBlock(id);
                assertPresent(block102);
                const content = [
                    "item1",
                    "item2",
                    "item3",
                    "Test bold italics linethrough underline",
                    "What is going on right now",
                    "Hello",
                    "World",
                    "Foo",
                    "bar",
                ];
                const items = block102.itemsAsArray;
                items.forEach((blockID, i) => {
                    const block = store.getBlock(blockID);
                    assertPresent(block);
                    assertMarkdownBlock(block);
                    assert.equal(block.content.data, content[i]);
                });

                const secondBlock = store.getBlock(items[1]);
                assertPresent(secondBlock);

                const level1Child1 = store.getBlock(secondBlock.itemsAsArray[0]);
                assertPresent(level1Child1);
                assertMarkdownBlock(level1Child1);
                assert.equal(level1Child1.content.data, "hmm");

                const level2Child2 = store.getBlock(secondBlock.itemsAsArray[1]);
                assertPresent(level2Child2);
                assertMarkdownBlock(level2Child2);
                assert.equal(level2Child2.content.data, "world");

                const level3Child = store.getBlock(level2Child2.itemsAsArray[0]);
                assertPresent(level3Child);
                assertMarkdownBlock(level3Child);
                assert.equal(level3Child.content.data, "potato");
            });
        });
    });
});


export namespace JSDOMParser {
    declare var global: any;

    export function makeGlobal(html: string = '') {

        if (typeof window !== 'undefined') {
            return;
        }

        const url = 'https://www.example.com';
        const opts: ConstructorOptions = {url, contentType: 'text/html', resources: 'usable'};
        const dom = new JSDOM(`<html><body>${html}</body></html>`, opts);

        global.window = dom.window;
        global.NodeFilter = dom.window.NodeFilter;
        global.document = dom.window.document;

        return dom.window.document.body as HTMLElement;

    }

}
