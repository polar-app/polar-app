import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {BlockContent, BlockContentMap, BlocksStore, Interstitial} from "./BlocksStore";
import {assertJSON} from "../../test/Assertions";
import {Arrays} from "polar-shared/src/util/Arrays";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assert} from 'chai';
import {isObservable, isObservableProp} from 'mobx';
import {ReverseIndex} from "./ReverseIndex";
import {Block} from "./Block";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {ConstructorOptions, JSDOM} from "jsdom";
import {NameContent} from "../content/NameContent";
import {MarkdownContent} from "../content/MarkdownContent";
import {Asserts} from "polar-shared/src/Asserts";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {HTMLToBlocks, IBlockContentStructure} from "../HTMLToBlocks";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {WriteController, WriteFileProgress} from "../../datastore/Datastore";
import {ProgressTrackerManager} from "../../datastore/FirebaseCloudStorage";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {BlockTextContentUtils} from "../NoteUtils";
import {DateContent} from "../content/DateContent";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {Backend} from "polar-shared/src/datastore/Backend";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import assertPresent = Asserts.assertPresent;

function assertTextBlock(content: BlockContent): asserts content is MarkdownContent | NameContent {

    if (content.type !== 'markdown' && content.type !== 'name') {
        throw new Error("wrong type: " + content.type);
    }

}

export function assertBlockType<T extends BlockContent['type']>(type: T, block: Block): asserts block is Block<BlockContentMap[T]> {
    if (block.content.type !== type) {
        throw new Error("wrong type: " + block.content.type);
    }
}

function assertBlocksEqual(block1: IBlock, block2: IBlock) {
    assert.equal(block1.id, block2.id, `${block1.id} should have the correct id`);
    assert.equal(block1.nspace, block2.nspace, `${block1.id} should have the correct namespace`);
    assert.equal(block1.uid, block2.uid, `${block1.id}  should have the correct uid`);
    assert.equal(block1.parent, block2.parent, `${block1.id} should have the correct parent`);
    assert.equal(block1.created, block2.created, `${block1.id} should have the correct creation date`);
    assert.equal(block1.updated, block2.updated, `${block1.id} should have the correct update date`);
    assert.deepEqual(block1.content, block2.content, `${block1.id} should have the correct content`);
    assert.deepEqual(block1.parents, block2.parents, `${block1.id}  should have the correct parents path`);
    assert.deepEqual(
        PositionalArrays.toArray(block1.items),
        PositionalArrays.toArray(block2.items),
        `${block1.id} should have the correct items`,
    );
}

function assertBlockParents(store: BlocksStore, parents: ReadonlyArray<BlockIDStr>) {
    return (blockID: BlockIDStr) =>  {
        const block = store.getBlockForMutation(blockID);
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
        "Snapshots should have the same blocks"
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

type BlockTree = ReadonlyArray<{id: BlockIDStr,  children: BlockTree}>;

const assertBlockTree = (store: BlocksStore, blockTree: BlockTree, parent?: Block) => {
    for (const item of blockTree) {
        const block = store.getBlockForMutation(item.id);
        assertPresent(block);
        if (parent) {
            assert.equal(block.parent, parent.id, `Block ${block.id} should have the correct parent`);
            assert.deepEqual(block.parents, [...parent.parents, parent.id], `Block ${block.id} should have the correct parents`);
        }
        assert.deepEqual(block.itemsAsArray, item.children.map(({id}) => id), `Block ${block.id} should have the correct items`);
        assertBlockTree(store, item.children, block);
    }
};


export function createStore() {
    const blocks = MockBlocks.create();
    const store = new BlocksStore('1234', UndoQueues2.create({limit: 50}));
    store.doPut(blocks);
    return store;
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

    describe("Observability", () => {

        it("BlocksStore", () => {

            const store = new BlocksStore('1234', UndoQueues2.create());

            assert.isTrue(isObservable(store));
            assert.isTrue(isObservableProp(store, 'active'));
            assert.isTrue(isObservableProp(store, 'index'));
            assert.isTrue(isObservableProp(store, 'indexByName'));
            assert.isTrue(isObservableProp(store, 'reverse'));
            assert.isTrue(isObservableProp(store, 'expanded'));
            assert.isTrue(isObservableProp(store, 'selected'));
            assert.isTrue(isObservableProp(store, 'dropTarget'));
            assert.isTrue(isObservableProp(store, 'dropSource'));
            assert.isTrue(isObservableProp(store, 'interstitials'));

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
            "relatedTagsManager": {
                "docTagsIndex": {
                    "102": {
                        "tagRefs": {
                            "World War II": {
                                "refs": 1
                            }
                        }
                    },
                    "107": {
                        "tagRefs": {
                            "Germany": {
                                "refs": 1
                            }
                        }
                    },
                    "108": {
                        "tagRefs": {
                            "Russia": {
                                "refs": 1
                            }
                        }
                    },
                    "109": {
                        "tagRefs": {
                            "Canada": {
                                "refs": 1
                            }
                        }
                    },
                    "112": {
                        "tagRefs": {
                            "Winston Churchill": {
                                "refs": 1
                            }
                        }
                    },
                    "113": {
                        "tagRefs": {
                            "Image parent": {
                                "refs": 1
                            }
                        }
                    },
                    "2020document": {
                        "tagRefs": {
                            "Potato document": {
                                "refs": 1
                            }
                        }
                    }
                },
                "tagDocsIndex": {
                    "Canada": {
                        "docs": {
                            "109": true
                        },
                        "tag": "Canada"
                    },
                    "Germany": {
                        "docs": {
                            "107": true
                        },
                        "tag": "Germany"
                    },
                    "Image parent": {
                        "docs": {
                            "113": true
                        },
                        "tag": "Image parent"
                    },
                    "Potato document": {
                        "docs": {
                            "2020document": true
                        },
                        "tag": "Potato document"
                    },
                    "Russia": {
                        "docs": {
                            "108": true
                        },
                        "tag": "Russia"
                    },
                    "Winston Churchill": {
                        "docs": {
                            "112": true
                        },
                        "tag": "Winston Churchill"
                    },
                    "World War II": {
                        "docs": {
                            "102": true
                        },
                        "tag": "World War II"
                    }
                },
                "tagsIndex": {
                    "102": {
                        "id": "102",
                        "label": "World War II"
                    },
                    "107": {
                        "id": "107",
                        "label": "Germany"
                    },
                    "108": {
                        "id": "108",
                        "label": "Russia"
                    },
                    "109": {
                        "id": "109",
                        "label": "Canada"
                    },
                    "112": {
                        "id": "112",
                        "label": "Winston Churchill"
                    },
                    "113": {
                        "id": "113",
                        "label": "Image parent"
                    },
                    "2020document": {
                        "id": "2020document",
                        "label": "Potato document"
                    }
                }
            },
            "_index": {
                "102": {
                    "_content": {
                        "_data": "World War II",
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "name",
                        "_links": [],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "102",
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "103",
                        [PositionalArrays.generateKey(2)]: "104",
                        [PositionalArrays.generateKey(3)]: "105"
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
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
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
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "104",
                    "_items": {[PositionalArrays.generateKey(1)]: "116"},
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
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "105",
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "106"
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
                        "_links": [
                            {
                                "id": "112",
                                "text": "Winston Churchill"
                            }
                        ],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "106",
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "117",
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
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "name",
                        "_links": [],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "107",
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "110"
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
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "name",
                        "_links": [],
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
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "name",
                        "_links": [],
                    },
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_id": "109",
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "111"
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
                        "_links": [
                            {
                                "id": "102",
                                "text": "World War II"
                            }
                        ],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
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
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "markdown",
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
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": "name",
                        "_links": [],
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
                        "_data": 'Some random markdown',
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": 'markdown',
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
                        "_data": 'Nested child with links [[Winston]]',
                        "_links": [{ id: '112', text: 'Winston' }],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": 'markdown',
                    },
                    "_items": {
                        [PositionalArrays.generateKey(1)]: "118"
                    },
                    "_mutation": 0,
                },
                "118": {
                    "_id": '118',
                    "_nspace": "ns101",
                    "_parent": "117",
                    "_parents": ["102", "105", "106", "117"],
                    "_root": "102",
                    "_uid": "123",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'markdown',
                        "_data": 'Deeply nested child',
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                    },
                    "_items": {},
                    "_mutation": 0,
                },
                "113": {
                    "_id": '113',
                    "_uid": "123",
                    "_parents": [],
                    "_nspace": 'ns101',
                    "_root": '113',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_data": 'Image parent',
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_type": 'name',
                        "_links": [],
                    },
                    "_items": PositionalArrays.create([
                        '114image',
                        '115',
                    ]),
                    "_mutation": 0,
                },
                "114image": {
                    "_id": '114image',
                    "_nspace": 'ns101',
                    "_parent": '113',
                    "_parents": ['113'],
                    "_root": '113',
                    "_uid": "123",
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'image',
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_src": 'https://google.com',
                        "_naturalHeight": 100,
                        "_naturalWidth": 100,
                        "_width": 100,
                        "_height": 100,
                        "_links": [],
                    },
                    "_items": {},
                    "_mutation": 0,
                },
                "115": {
                    "_id": '115',
                    "_nspace": 'ns101',
                    "_uid": "123",
                    "_parent": '113',
                    "_parents": ['113'],
                    "_root": '113',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_data": '',
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_links": [],
                        "_type": 'markdown',
                    },
                    "_items": {},
                    "_mutation": 0,
                },
                "2020document": {
                    "_id": '2020document',
                    "_nspace": "ns101",
                    "_uid": "123",
                    "_parents": [],
                    "_root": '2020document',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'document',
                        "_links": [],
                        "_docInfo": {
                            "flagged": false,
                            "nrPages": 55,
                            "archived": false,
                            "progress": 55,
                            "properties": {},
                            "attachments": {},
                            "fingerprint": '2020document',
                            "pagemarkType": PagemarkType.SINGLE_COLUMN,
                            "title": "Potato document",
                            "nrAreaHighlights": 1,
                            "nrTextHighlights": 1,
                            "nrFlashcards": 1,
                            "nrComments": 1,
                            "nrAnnotations": 4,
                        },
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                    },
                    "_items": PositionalArrays.create([
                        '2021text',
                        '2022area',
                    ]),
                    "_mutation": 0,
                },
                "2021text": {
                    "_id": '2021text',
                    "_nspace": 'ns101',
                    "_uid": '123',
                    "_parent": '2020document',
                    "_parents": ['2020document'],
                    "_root": '2020document',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": AnnotationContentType.TEXT_HIGHLIGHT,
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_docID": '2020document',
                        "_links": [],
                        "_pageNum": 15,
                        "_value": {
                            "text": 'text highlight content',
                            "rects": {},
                            "color": 'yellow',
                        }
                    },
                    "_items": {},
                    "_mutation": 0,
                },
                "2022area": {
                    "_id": '2022area',
                    "_nspace": 'ns101',
                    "_uid": '123',
                    "_parent": '2020document',
                    "_parents": ['2020document'],
                    "_root": '2020document',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": AnnotationContentType.AREA_HIGHLIGHT,
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_docID": '2020document',
                        "_pageNum": 15,
                        "_links": [],
                        "_value": {
                            "rects": {},
                            "color": 'yellow',
                            "image": {
                                "id": 'http://google.com',
                                "type": 'image/png',
                                "src": { backend: Backend.IMAGE, name: 'google.png' }
                            },
                        }
                    },
                    "_items": PositionalArrays.create(['2023flashcard', '2024']),
                    "_mutation": 0,
                },
                "2023flashcard": {
                    "_id": '2023flashcard',
                    "_nspace": "ns101",
                    "_uid": "123",
                    "_parent": '2022area',
                    "_parents": ['2020document', '2022area'],
                    "_root": '2020document',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": AnnotationContentType.FLASHCARD,
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "_docID": '2020document',
                        "_pageNum": 15,
                        "_links": [],
                        "_value": {
                            "type": FlashcardType.BASIC_FRONT_BACK,
                            "fields": {
                                "front": 'front',
                                "back": 'back',
                            },
                            "archetype": 'whatever'
                        }
                    },
                    "_items": {},
                    "_mutation": 0,
                },
                "2024": {
                    "_id": '2024',
                    "_nspace": 'ns101',
                    "_uid": '123',
                    "_parent": '2022area',
                    "_parents": ['2020document', '2022area'],
                    "_root": '2020document',
                    "_created": "2012-03-02T11:38:49.321Z",
                    "_updated": "2012-03-02T11:38:49.321Z",
                    "_content": {
                        "_type": 'markdown',
                        "_data": 'Annotation markdown child',
                        "_links": [],
                        "_mutator": DeviceIDManager.TEST_DEVICE_ID,
                    },
                    "_items": {},
                    "_mutation": 0,
                },
            },
            "_indexByName": {
                "canada": "109",
                "germany": "107",
                "russia": "108",
                "winston churchill": "112",
                "world war ii": "102",
                "image parent": "113",
                "potato document": "2020document",
            },
            "_indexByDocumentID": {
                "2020document": "2020document",
            },
            "_activeBlocksIndex": {},
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
            "_interstitials": {},
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
            .map(id => store.getBlockForMutation(id)!)
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

    describe("interstitials", () => {
        let controller: WriteController;
        let progressTracker: ProgressTrackerManager<WriteFileProgress>;

        beforeEach(() => {
            controller = {
                pause: () => false,
                resume: () => false,
                cancel: () => false,
            };
            progressTracker = new ProgressTrackerManager();
        });

        describe("addInterstitial", () => {
            it("should be able to add interstitials properly", () => {
                const store = createStore();

                store.addInterstitial('102', {
                    type: 'image',
                    id: 'someid',
                    position: 'top',
                    blobURL: 'url',
                    controller,
                    progressTracker,
                });

                assertJSON(store.interstitials, {
                    '102': [{
                        type: 'image',
                        id: 'someid',
                        position: 'top',
                        blobURL: 'url',
                        controller,
                        progressTracker,
                    }]
                });
            });

            it("should store new interstitials that belong to the same block first", () => {
                const store = createStore();

                store.addInterstitial('102', {
                    type: 'image',
                    id: 'id1',
                    position: 'top',
                    blobURL: 'url1',
                    controller,
                    progressTracker,
                });
                store.addInterstitial('102', {
                    type: 'image',
                    id: 'id2',
                    position: 'top',
                    blobURL: 'url2',
                    controller,
                    progressTracker,
                });

                assertJSON(store.interstitials,{
                    '102': [{
                        type: 'image',
                        id: 'id2',
                        position: 'top',
                        blobURL: 'url2',
                        controller,
                        progressTracker,
                    }, {
                        type: 'image',
                        id: 'id1',
                        position: 'top',
                        blobURL: 'url1',
                        controller,
                        progressTracker,
                    }]
                });
            });
        });

        describe("removeInterstitial", () => {
            it("should delete interstitials that belong to a specific block properly", () => {
                const store = createStore();

                store.addInterstitial('102', {
                    type: 'image',
                    id: 'id1',
                    position: 'top',
                    blobURL: 'url1',
                    controller,
                    progressTracker,
                });

                store.removeInterstitial('102', 'id1');

                assertJSON(store.interstitials, {});
            });
        });

        describe("getInterstitials", () => {
            it("should get all the interstitials for a specific block", () => {
                const store = createStore();
                const interstitial: Interstitial = {
                    type: 'image',
                    id: 'id1',
                    position: 'top',
                    blobURL: 'url1',
                    controller,
                    progressTracker,
                };

                store.addInterstitial('102', interstitial);

                assertJSON(store.getInterstitials('102'), [interstitial]);
            });
        });
    });

    describe("indent/unindent Block", () => {
        const root = '102';
        let store: BlocksStore;

        beforeEach(() => {
            store = createStore();
        });

        it("second child block", async function() {
            assertJSON(store.getBlockForMutation('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "name",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": PositionalArrays.create([
                    "103",
                    "104",
                    "105"
                ]),
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            TestingTime.forward(1000);

            const indentResult = store.indentBlock(root, '104')

            assertJSON(store.getBlockForMutation('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "name",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    [PositionalArrays.generateKey(1)]: "103",
                    [PositionalArrays.generateKey(3)]: "105"
                },
                "mutation": 1,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:50.321Z"
            });

            assertJSON(store.getBlockForMutation(indentResult[0].value!)?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945",
                    "links": [],
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "markdown",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": PositionalArrays.create(["104"]),
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
            const indent0 = store.indentBlock(root, '104');
            const indent1 = store.indentBlock(root, '104');

            assert.equal(indent1.length, 1);

            assert.equal(indent1[0].error, 'no-sibling');

        });

        it("indent then unindent and make sure we do a full restore to the original", () => {
            assertJSON(store.getBlockForMutation('102')?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "type": "name",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": PositionalArrays.create([
                    "103",
                    "104",
                    "105"
                ]),
                "mutation": 0,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

            assertJSON(store.expanded, {});

            assertJSON(store.getBlockForMutation('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "links": [],
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "markdown",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": PositionalArrays.create(["116"]),
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

            store.indentBlock(root, '104')

            assertJSON(store.getBlockForMutation('104')?.toJSON(), {
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "links": [],
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "markdown",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": PositionalArrays.create(["116"]),
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

            assert.equal(store.getBlockForMutation('104')!.parent, '103');

            store.unIndentBlock(root, '104');

            assertJSON(store.getBlockForMutation('104')?.toJSON(),{
                "content": {
                    "data": "Axis Powers: Germany, Italy, Japan",
                    "links": [],
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "markdown",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "104",
                "items": PositionalArrays.create(["116"]),
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

            assertJSON(store.getBlockForMutation('102')?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "name",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": PositionalArrays.create([
                    "103",
                    "104",
                    "105"
                ]),
                "mutation": 2,
                "nspace": "ns101",
                "parents": [],
                "root": "102",
                "uid": "123",
                "updated": "2012-03-02T11:38:49.321Z"
            });

        });

        it("indent on a root node", () => {
            const indentResult = store.indentBlock('108', '108')

            assert.equal(indentResult[0].error!, 'no-parent');

        });

        it("indent the first node and fail properly", () => {
            // this should not work because there should be no previous sibling
            // to make as the new parent.
            const indentResult = store.indentBlock(root, '103')

            assert.equal(indentResult[0].error!, 'no-sibling');

        });

        it("should not be able to indent with a block that is a custom root", () => {
            const indentResult = store.indentBlock('104', '104')

            assert.equal(indentResult[0].error!, 'no-parent');
        });

        it("should not allow unindenting a child of an annotation", () => {
            const unIndentResult = store.unIndentBlock('2020document', '2024');

            assert.equal(unIndentResult[0].error!, 'grandparent-is-document');
        });

        it("Should not allow unindenting a highlight block", () => {
            const unIndentResult = store.unIndentBlock('2020document', '2022area');

            assert.equal(unIndentResult[0].error!, 'no-parent-block-parent');
        });

        it("Should not allow indenting text highlight blocks", () => {
            const indentResult = store.indentBlock('2020document', '2021text');

            assert.equal(indentResult[0].error!, 'annotation-block');
        });

        it("Should not allow indenting area highlight blocks", () => {
            const indentResult = store.indentBlock('2020document', '2022area');

            assert.equal(indentResult[0].error!, 'annotation-block');
        });

        it("Should not allow indenting flashcard blocks", () => {
            const indentResult = store.indentBlock('2020document', '2023flashcard');

            assert.equal(indentResult[0].error!, 'annotation-block');
        });

        it("should work with multiple blocks selected and update the parents of nested children", () => {
            store = createStore();
            store.computeLinearTree(root).forEach(block => store.expanded[block] = true);
            store.setSelectionRange(root, '103', '117');
            store.indentBlock(root, '105');

            const blockTree: BlockTree = [
                {
                    id: '102',
                    children: [
                        {
                            id: '103',
                            children: [
                                {id: '104', children: [{id: '116', children: []}]},
                                {
                                    id: '105',
                                    children: [{
                                        id: '106',
                                        children: [{
                                            id: '117',
                                            children: [
                                                {id: '118', children: []}
                                            ]
                                        }]
                                    }]
                                },
                            ]
                        }
                    ]
                }
            ];

            assertBlockTree(store, blockTree);
        });

        it("should unindent properly with a custom root", () => {
            const root = '106';
            store.computeLinearTree(root, {includeInitial: true})
                .forEach(block => store.expanded[block] = true);
            // With a selection
            store.setSelectionRange(root, '118', '118');
            store.unIndentBlock(root, '118');

            const blockTree: BlockTree = [
                {
                    id: '105',
                    children: [{
                        id: '106',
                        children: [
                            {id: '117', children: []},
                            {id: '118', children: []},
                        ]
                    }]
                }
            ];

            assertBlockTree(store, blockTree);

            // Unindenting again shouldn't be allowed
            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');

            assertBlockTree(store, blockTree);

            // without a selection
            store.clearSelected('indent/unindent test');
            store.indentBlock(root, '118');

            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');
            store.unIndentBlock(root, '118');
            assertBlockTree(store, blockTree);
        });

        it("should not be able to indent/unindent a custom root", () => {
            const root = '105';
            store.computeLinearTree(root, {includeInitial: true})
                .forEach(block => store.expanded[block] = true);
            store.setSelectionRange(root, '105', '118');
            store.unIndentBlock(root, root)
            store.unIndentBlock(root, root)

            const blockTree: BlockTree = [
                {
                    id: '102',
                    children: [
                        {id: '103', children: []},
                        {id: '104', children: [{id: '116', children: []}]},
                        {
                            id: '105',
                            children: [{
                                id: '106',
                                children: [{
                                    id: '117',
                                    children: [
                                        {id: '118', children: []}
                                    ]
                                }]
                            }]
                        },
                    ]
                }
            ];

            assertBlockTree(store, blockTree);

            store.indentBlock(root, root)
            store.indentBlock(root, root)
            store.indentBlock(root, root)
            assertBlockTree(store, blockTree);
        });

        it("should not allow unindenting root blocks", () => {
            const indentResult = store.unIndentBlock('102', '102');

            assert.equal(indentResult[0].error!, 'no-parent');
        });
    });

    it("basic", async function() {

        const store = createStore();

        assert.deepEqual(new Set(Object.keys(store.index)), new Set([
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
            "113",
            "114image",
            "115",
            "2020document",
            "2021text",
            "2022area",
            "2023flashcard",
            "2024",
        ]), "The store index should have the correct blocks");

        assertJSON(Object.keys(store.indexByName), [
            "world war ii",
            "russia",
            "canada",
            "germany",
            "winston churchill",
            "image parent",
            "potato document",
        ]);

        assertJSON(Arrays.first(Object.values(store.index))?.toJSON(), {
            "content": {
                "data": "World War II",
                "mutator": DeviceIDManager.TEST_DEVICE_ID,
                "type": "name",
                "links": [],
            },
            "created": "2012-03-02T11:38:49.321Z",
            "id": "102",
            "items": PositionalArrays.create([
                "103",
                "104",
                "105"
            ]),
            "mutation": 0,
            "nspace": "ns101",
            "parents": [],
            "root": "102",
            "uid": "123",
            "updated": "2012-03-02T11:38:49.321Z"
        });

    });

    describe('createLinkToBlock', () => {
        it('Should create a link to a specified target block properly & update the reverse index properly', () => {
            const store = createStore();
            const source = store.getBlockForMutation('110');
            const target = store.getBlockForMutation('109');

            assertPresent(source);
            assertPresent(target);
            assertBlockType('name', target);
            assertBlockType('markdown', source);

            const targetName = BlockTextContentUtils.getTextContentMarkdown(target.content);
            const sourceText = BlockTextContentUtils.getTextContentMarkdown(source.content);
            store.createLinkToBlock(source.id, targetName, sourceText + ` [[targetName]]`);

            const newSource = store.getBlockForMutation('110');
            assertPresent(newSource);
            assertBlockType('markdown', newSource);

            const newText = BlockTextContentUtils.getTextContentMarkdown(newSource.content);
            assert.equal(newText, sourceText + ` [[targetName]]`);

            assert.isTrue(store._reverse.get('109').indexOf('110') > -1);
        });

        it('Should not allow creating links on name or date blocks', () => {
            const store = createStore();
            const dateID = store.createNewNamedBlock({
                content: new DateContent({ format: 'YYYY-MM-DD', data: 'date', type: 'date', links: [] })
            });

            const nameID = store.createNewNamedBlock({
                content: new NameContent({ data: 'name', type: 'name', links: [] })
            });

            store.createLinkToBlock(dateID, '102', 'hello');

            const nameBlock = store.getBlockForMutation(nameID);
            assertPresent(nameBlock);
            assertBlockType('name', nameBlock);
            assert.equal(nameBlock.mutation, 0);
            assert.equal(nameBlock.content.data, 'name');

            store.createLinkToBlock(nameID, '102', 'world');
            const dateBlock = store.getBlockForMutation(dateID);
            assertPresent(dateBlock);
            assertBlockType('date', dateBlock);
            assertPresent(dateBlock);
            assert.equal(dateBlock.mutation, 0);
            assert.equal(dateBlock.content.data, 'date');

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
            const root = '102';

            assertJSON(store.canMergePrev(root, '104'), {
                "source": "104",
                "target": "103"
            });

        });

        it("unmergeable", () => {

            const store = createStore()
            const root = '102';

            assert.isUndefined(store.canMergePrev(root, '103'));

        });

        it("should not allow merging a custom root with its previous sibling", () => {
            const store = createStore();

            assert.isUndefined(store.canMergePrev('104', '104'));
            assert.isUndefined(store.canMergePrev('106', '106'));
        });

        it("should allow merging a block with its previous expansion sibling", () => {
            const store = createStore();

            store.expand('104');
            const blockMerge = store.canMergePrev('102', '105');

            assert.deepEqual(blockMerge, { source: '105', target: '116' });
        });

        it("should allow merging a first child with its parent", () => {
            const store = createStore();

            store.expand('104');
            const blockMerge = store.canMergePrev('102', '116');

            assert.deepEqual(blockMerge, { source: '116', target: '104' });
        });

        it("should allow merging 2 blocks of different types of the second one is empty", () => {
            const store = createStore();

            const blockMerge = store.canMergePrev('113', '115');
            assert.deepEqual(blockMerge, { source: '115', target: '114image' });
        });
    });

    describe("setSelectionRange", () => {
        const root = '102';
        let store: BlocksStore;

        beforeEach(() => {
            store = createStore();
            store.computeLinearTree('102').forEach(store.expand.bind(store));
        });

        it("should handle basic selection ranges (siblings only)", () => {
            store.setSelectionRange(root, '103', '104');

            assert.deepEqual(store.selected, arrayStream(['103', '104']).toMap2(c => c, () => true));
        });

        it("should handle complex structures (siblings with children)", () => {
            store.setSelectionRange(root, '103', '106');

            assert.deepEqual(store.selected, arrayStream(['103', '104', '105']).toMap2(c => c, () => true));
        });

        it("should handle bottom to top selections", () => {
            store.setSelectionRange(root, '106', '104');

            assert.deepEqual(store.selected, arrayStream(['104', '105']).toMap2(c => c, () => true));
        });

        it("should have the correct selected items when setting the selection multiple times with a complex structure", () => {
            store.setSelectionRange(root, '102', '104');
            store.setSelectionRange(root, '102', '117');
            store.setSelectionRange(root, '102', '118');

            assert.deepEqual(store.selected, arrayStream(['102']).toMap2(c => c, () => true));
        });

        it("should work with a custom root", () => {
            // we're collapsing the parent to make sure it is being ignored when doing the selection
            store.collapse('105');
            store.setSelectionRange('106', '117', '118');


            assert.deepEqual(store.selected, arrayStream(['117']).toMap2(c => c, () => true));
        });
    });

    describe("canMergeNext", () => {
        let store: BlocksStore;
        const root = '102';

        beforeEach(() => {
            store = createStore();
        });

        it("should allow merging blocks in the same level", () => {
            assertJSON(store.canMergeNext(root, '103'), {
                "source": "104",
                "target": "103"
            });
        });

        it("should allow merging a parent with its first child", () => {
            assertJSON(store.canMergeNext(root, '102'), {
                "source": "103",
                "target": "102"
            });
        });

        it("shouldn't allow merging blocks that have no siblings after them", () => {
            assert.isUndefined(store.canMergeNext(root, '110'));
        });

        it("should allow merging a block with its parent's next sibling no matter what depth the current block is at", () => {
            /*
                111
                    level1Block
                        level2Block <---| We should be able to merge these two
                parentNextSibling <-----|
            */

            const parentNextSibling = store.createNewBlock('111');
            Asserts.assertPresent(parentNextSibling);
            const level1Block = store.createNewBlock('111', {unshift: true});
            assertPresent(level1Block);
            const level2Block = store.createNewBlock(level1Block.id, {unshift: true});
            assertPresent(level2Block);

            assertJSON(store.canMergeNext(root, level2Block.id), {
                "source": parentNextSibling.id,
                "target": level2Block.id
            });
        });

        it("shouldn't allow merging with a block that isn't under a custom root", () => {
            const store = createStore();

            assert.isUndefined(store.canMergeNext('104', '116'));
            assert.isUndefined(store.canMergeNext('105', '118'));
        });
    });

    describe("moveBlock", () => {
        it("should not be able to move a root block", () => {
            const store = createStore();
            const id = '102';
            const blockBefore = store.getBlockForMutation(id)!.toJSON();
            store.moveBlocks([id], -1);
            const blockAfter = store.getBlockForMutation(id)!.toJSON();
            assertBlocksEqual(blockBefore, blockAfter);
        });

        it("should not be able to move a block that's already the first child in its parent's", () => {
            const store = createStore();
            const id = '103';
            const block = store.getBlockForMutation(id);
            assertPresent(block);
            assertPresent(block.parent);
            let parent = store.getBlockForMutation(block.parent);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);
            store.moveBlocks([id], -5);
            parent = store.getBlockForMutation(block.parent);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);
        });

        it("should be able to move a block upwards/downwards", () => {
            const store = createStore();
            const id = '105';
            const block = store.getBlockForMutation(id);
            assertPresent(block);
            const parentID = block.parent;
            assertPresent(parentID);
            let parent = store.getBlockForMutation(parentID);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            // Upwards
            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks([id], -5);
                parent = store.getBlockForMutation(parentID);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['105', '103', '104']);
            });

            // Downwards
            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks([id], 1);
                parent = store.getBlockForMutation(parentID);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['103', '105', '104']);
            });
        });

        it("should be able to move multiple blocks properly (upwards)", () => {
            const store = createStore();
            const id = '102';
            const parent = store.getBlockForMutation(id);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['105', '104'], -5);
                const parent = store.getBlockForMutation(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '105', '103']);
            });

        });

        it("should be able to move multiple blocks properly (downwards)", () => {
            const store = createStore();
            const id = '102';
            const parent = store.getBlockForMutation(id);
            assertPresent(parent);
            assert.deepEqual(parent.itemsAsArray, ['103', '104', '105']);

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['103', '105'], 5);
                const parent = store.getBlockForMutation(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '103', '105']);
            });

            createUndoRunner(store, [parent.id], () => {
                store.moveBlocks(['105', '104'], -1);
                const parent = store.getBlockForMutation(id);
                assertPresent(parent);
                assert.deepEqual(parent.itemsAsArray, ['104', '105', '103']);
            });
        });
    });

    describe("renameBlock", () => {
        it("Should allow renaming a block of type \"name\"", () => {
            const id = '102';
            const store = createStore();
            const oldName = (store.getBlock(id) as Block<NameContent>).content.data;

            store.renameBlock(id, 'New Name');

            const block = store.getBlock(id);
            assertPresent(block);
            const content = block.content
            assertTextBlock(content);

            assert.equal(content.data, 'New Name');

            // Check if the new name got properly inserted into the index
            assert.isOk(store.indexByName[content.data.toLowerCase()], "The new name should be in indexByName");

            // Check if the old name got removed.
            assert.isUndefined(store.indexByName[oldName.toLowerCase()], "The old name should be removed from indexByName");
        });
    });

    describe("mergeBlocks", () => {

        it("Merge empty first child with named block root", () => {

            const store = createStore()

            const createdBlock = store.createNewBlock('102');
            const root = '102';

            assertPresent(createdBlock);

            const block = store.getBlockForMutation('102')!;

            assertJSON(block.itemsAsArray, [
                createdBlock?.id,
                "103",
                "104",
                "105"
            ]);

            const newBlock = store.getBlockForMutation(createdBlock.id)!;

            assertTextBlock(newBlock!.content);

            assert.equal(newBlock.content.data, '');

            assert.ok(store.canMergePrev(root, newBlock.id));
            assert.ok(store.canMergeWithDelete(newBlock, block));

            assert.equal(store.mergeBlocks(block.id, newBlock.id), 'block-merged-with-delete');

            assertJSON(store.getBlockForMutation('102')!.itemsAsArray, [
                "103",
                "104",
                "105"
            ]);

            assert.isUndefined(store.getBlockForMutation(createdBlock.id));

        });

        it("basic merge", () => {

            const store = createStore()

            // merge 103 and 104

            TestingTime.forward(1000);

            assert.equal(store.getBlockForMutation('103')?.mutation, 0);
            assert.equal(store.getBlockForMutation('104')?.mutation, 0);

            store.mergeBlocks('103', '104');

            assert.isUndefined(store.getBlockForMutation('104'));

            assertJSON(store.getBlockForMutation('103')?.toJSON(), {
                "content": {
                    "data": "[Lasted](https://www.example.com) from 1939 to 1945Axis Powers: Germany, Italy, Japan",
                    "links": [],
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "markdown",
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "103",
                "items": PositionalArrays.create(['116']),
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
            const createdBlock1 = store.createNewBlock('104', {unshift: true});
            assertPresent(createdBlock1);

            const createdBlock2 = store.createNewBlock('106', {unshift: true});
            assertPresent(createdBlock2);
            const createdBlock3 = store.createNewBlock(createdBlock2.id, {unshift: true});
            assertPresent(createdBlock3);
            /*
             *   104----------------------------|-- We're merging these 2
             *       createdBlock1              |
             *       116                        |
             *   105 ---------------------------|
             *       106
             *           createdBlock2
             *               createdBlock3
             *           117
             *               118
             *
             *
             *   We should end up with
             *   104
             *       createdBlock1
             *       116
             *       106
             *           createdBlock2
             *                  createdBlock3
             *           117
             *               118
            */

            const identifiers = [
                '104',
                '105',
            ];

            createUndoRunner(store, identifiers, () => {
                store.mergeBlocks('104', '105');

                const blockTree: BlockTree = [
                    {
                        id: '104', children: [
                            {id: createdBlock1.id, children: []},
                            {id: '116', children: []},
                            {
                                id: '106', children: [
                                    {id: createdBlock2.id, children: [{id: createdBlock3.id, children: []}]},
                                    {id: '117', children: [{id: '118', children: []}]},
                                ]
                            },
                        ]
                    }
                ];

                assertBlockTree(store, blockTree);
            });
        });

        it('should update the link index properly when merging blocks that have links', () => {
            const store = createStore()
            const root = '102';
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
            store.indentBlock(root, createdBlock2.id);
            store.setBlockContent(createdBlock2.id, new MarkdownContent({
                type: 'markdown',
                data: 'new [[block]]',
                links: [
                    {id: linkBlock2.id, text: 'block'},
                ]
            }));

            store.mergeBlocks(createdBlock1.id, createdBlock2.id);

            const block1 = store.getBlockForMutation(createdBlock1.id);
            const block2 = store.getBlockForMutation(createdBlock2.id);

            assertPresent(block1);
            assertBlockType('markdown', block1);
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

                const block = store.getBlockForMutation('102')

                assertPresent(block);

                assertJSON(block.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "type": "name",
                        "links": [],
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": PositionalArrays.create([
                        "103",
                        "104",
                        "105"
                    ]),
                    "mutation": 0,
                    "nspace": "ns101",
                    "parents": [],
                    "root": "102",
                    "uid": "123",
                    "updated": "2012-03-02T11:38:49.321Z"
                });

                TestingTime.forward(1000);

                block.withMutation(() => {
                    block.setContent({ type: 'name', data: "World War Two", links: [] })
                })

                assertJSON(block?.toJSON(),{
                    "content": {
                        "data": "World War Two",
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "type": "name",
                        "links": [],
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": PositionalArrays.create([
                        "103",
                        "104",
                        "105"
                    ]),
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

            const block = store.getBlockForMutation('102');

            assertJSON(block?.toJSON(), {
                "content": {
                    "data": "World War II",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "name",
                    "links": [],
                },
                "created": "2012-03-02T11:38:49.321Z",
                "id": "102",
                "items": {
                    [PositionalArrays.generateKey(1)]: "103",
                    [PositionalArrays.generateKey(3)]: "105"
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

            const block = store.getBlockForMutation('102');

            assertJSON(block?.toJSON(),{
                "content": {
                    "data": "World War II",
                    "mutator": DeviceIDManager.TEST_DEVICE_ID,
                    "type": "name",
                    "links": [],
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

                assertJSON(blocksStore.getBlockForMutation('102')?.toJSON(), {
                    "content": {
                        "data": "World War II",
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "type": "name",
                        "links": [],
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": "102",
                    "items": {
                        [PositionalArrays.generateKey(0)]: createdBlock?.id,
                        [PositionalArrays.generateKey(1)]: "103",
                        [PositionalArrays.generateKey(2)]: "104",
                        [PositionalArrays.generateKey(3)]: "105"
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

                assertJSON(blocksStore.getBlockForMutation('104')?.toJSON(), {
                    "content": {
                        "data": "Axis ",
                        "links": [],
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "type": "markdown",
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

                assertJSON(blocksStore.getBlockForMutation(createdBlock!.id)?.toJSON(), {
                    "content": {
                        "data": "Powers: Germany, Italy, Japan",
                        "links": [],
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "type": "markdown",
                    },
                    "created": "2012-03-02T11:38:49.321Z",
                    "id": createdBlock!.id,
                    "items": PositionalArrays.create(['116']),
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

            let block = store.getBlockForMutation('102');

            TestingTime.forward(60 * 1000);

            const now = ISODateTimeStrings.create();

            assertJSON(block!.itemsAsArray, ["103", "104", "105"]);

            const createdBlock = store.createNewBlock('102');

            assertPresent(createdBlock);

            block = store.getBlockForMutation('102');

            assertJSON(block!.itemsAsArray, [createdBlock.id, "103", "104", "105"]);

            const newBlock = store.getBlockForMutation(createdBlock.id)!;

            assert.equal(newBlock.created, now);
            assert.equal(newBlock.updated, now);
            assert.equal(newBlock.parent, block!.id);

            assert.equal(block!.updated, now);

            // assertJSON(store, {});

        });

        it("Add child to root node with no children", () => {

            const store = createStore();

            let block = store.getBlockForMutation('102');

            store.deleteBlocks(['103', '104', '105']);

            block = store.getBlockForMutation('102');
            assertJSON(block!.items, {});

            const createdBlock = store.createNewBlock('102');
            assertPresent(createdBlock);
            block = store.getBlockForMutation('102');

            assertJSON(block!.itemsAsArray, [createdBlock.id]);

        });

        it("Make sure it's the child of an expanded block", () => {

            const store = createStore();

            function createBlockWithoutExpansion() {

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '102');

                const block = store.getBlockForMutation('102');

                assertJSON(block!.itemsAsArray, ["103", "104", "105", createdBlock?.id]);

            }

            function createBlockWithExpansion() {
                store.expand('105');

                const createdBlock = store.createNewBlock('105');
                assertPresent(createdBlock);

                assert.equal(createdBlock.parent, '105');

                const block = store.getBlockForMutation('105');

                assertJSON(block!.itemsAsArray, [createdBlock?.id, "106"]);

            }

            createBlockWithoutExpansion();
            createBlockWithExpansion();



        });

        it("Split a block with children", () => {

            const store = createStore();

            function doFirstSplit() {

                const id = '105'

                const originalBlock = store.getBlockForMutation(id);

                assertPresent(originalBlock);

                assertBlockType('markdown', originalBlock);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});
                assertPresent(createdBlock);

                const newBlock = store.getBlockForMutation(createdBlock.id);
                assertPresent(newBlock);
                assertPresent(newBlock.parent);
                const parentBlock = store.getBlockForMutation(newBlock.parent);
                assertPresent(parentBlock);

                assertJSON(parentBlock.itemsAsArray, [
                    "103",
                    "104",
                    "105",
                    createdBlock.id
                ]);

                newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));

                return createdBlock.id;

            }

            function doSecondSplit(id: BlockIDStr) {

                const originalBlock = store.getBlockForMutation(id);

                assertPresent(originalBlock);
                assertBlockType('markdown', originalBlock);

                const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});

                assertPresent(createdBlock);

                const newBlock = store.getBlockForMutation(createdBlock.id);
                assertPresent(newBlock);
                assertPresent(newBlock.parent);
                const parentBlock = store.getBlockForMutation(newBlock.parent);
                assertPresent(parentBlock);
                assertPresent(createdBlock);

                assertJSON(parentBlock.itemsAsArray, [
                    "103",
                    "104",
                    "105",
                    id,
                    createdBlock.id
                ]);

                newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));
            }

            const firstSplitBlockID = doFirstSplit();

            doSecondSplit(firstSplitBlockID);

        });

        it('should properly split a block with multiple levels of nested children', () => {
            const store = createStore();
            const id = '105';
            const originalBlock = store.getBlockForMutation(id);

            assertPresent(originalBlock);
            assertBlockType('markdown', originalBlock);

            const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: originalBlock!.content.data}});

            assertPresent(createdBlock);

            const newBlock = store.getBlockForMutation(createdBlock.id);
            assertPresent(newBlock);
            assertPresent(newBlock.parent);
            const parentBlock = store.getBlockForMutation(newBlock.parent);
            assertPresent(parentBlock);
            assertPresent(createdBlock);

            assertJSON(parentBlock.itemsAsArray, [
                "103",
                "104",
                "105",
                createdBlock.id
            ]);

            newBlock.itemsAsArray.forEach(assertBlockParents(store, [...newBlock.parents, newBlock.id]));
        });

        it("should create a new child in a block with children (when suffix is empty and the block is expanded)", () => {
            const store = createStore();

            const id = '105';
            store.expand(id);

            let originalBlock = store.getBlockForMutation(id);

            assertPresent(originalBlock);

            assertTextBlock(originalBlock.content);

            const createdBlock = store.createNewBlock(id, {split: {prefix: originalBlock.content.data, suffix: ''}});
            assertPresent(createdBlock);

            originalBlock = store.getBlockForMutation(id);

            assertPresent(originalBlock);

            assert.deepEqual(originalBlock.itemsAsArray, [
                createdBlock.id,
                '106'
            ]);

            const newBlock = store.getBlockForMutation(createdBlock.id);
            assertPresent(newBlock);

            assert.equal(newBlock.parent, id);
            assert.deepEqual(newBlock.parents, [...originalBlock.parents, id]);
        });

        it("should create a new sibling in a block with children if the block is collapsed (even when suffix is empty)", () => {
            const store = createStore();

            const id = '105';

            let originalBlock = store.getBlock(id);

            assertPresent(originalBlock);

            assertTextBlock(originalBlock.content);

            const createdBlock = store.createNewBlock(id, {split: {prefix: originalBlock.content.data, suffix: ''}});
            assertPresent(createdBlock);
            assertPresent(originalBlock.parent);

            const parent = store.getBlock(originalBlock.parent);

            assertPresent(parent);

            assert.deepEqual(parent.itemsAsArray, [
                '103',
                '104',
                '105',
                createdBlock.id,
            ]);

            const newBlock = store.getBlock(createdBlock.id);
            assertPresent(newBlock);

            assert.equal(newBlock.parent, originalBlock.parent);
            assert.deepEqual(newBlock.parents, [...originalBlock.parents]);
        });


        it("should create a new child in the refed block (when the unshift option is true)", () => {
            const store = createStore();

            const id = '105';

            let originalBlock = store.getBlockForMutation(id);

            assertPresent(originalBlock);

            assertTextBlock(originalBlock.content);

            const createdBlock = store.createNewBlock(id, {unshift: true});
            assertPresent(createdBlock);

            originalBlock = store.getBlockForMutation(id);

            assertPresent(originalBlock);

            assert.deepEqual(originalBlock.itemsAsArray, [
                createdBlock.id,
                '106'
            ]);

            const newBlock = store.getBlockForMutation(createdBlock.id);
            assertPresent(newBlock);

            assert.equal(newBlock.parent, id);
            assert.deepEqual(newBlock.parents, [...originalBlock.parents, id]);
        });

        it("should expand the parent if the new block is being added as a child", () => {
            const store = createStore();
            const id = '105';
            // collapse the parent node to make sure it gets expanded when the child is created
            store.collapse(id);
            const createdBlock = store.createNewBlock(id, {unshift: true});
            assertPresent(createdBlock);
            assert.equal(store.isExpanded(id), true);
        });

        it("should copy the expand state from the old block to the new one if the new block is inheriting the items", () => {
            const store = createStore();
            const id = '105';
            const oldBlock = store.getBlockForMutation(id);
            assertPresent(oldBlock);
            assertBlockType('markdown', oldBlock);
            // collapse the parent node to make sure it gets expanded when the child is created
            store.collapse(id);
            const createdBlock = store.createNewBlock(id, {split: {prefix: '', suffix: oldBlock.content.data}});
            assertPresent(createdBlock);
            assert.equal(store.isExpanded(createdBlock.id), false);

            const block1 = store.getBlockForMutation(createdBlock.id);
            assertPresent(block1);
            assertBlockType('markdown', block1);

            store.expand(block1.id);
            const createdBlock2 = store.createNewBlock(block1.id, {split: {prefix: '', suffix: block1.content.data}});
            assertPresent(createdBlock2);
            assert.equal(store.isExpanded(createdBlock2.id), true);
        });

        it("should split the links properly when a block is split", () => {
            const store = createStore();
            const root = '102';
            const link1 = { id: '2024', text: '(hello)' };
            const link2 = { id: '2024', text: '[[world]]' };
            const content: IMarkdownContent = {
                type: 'markdown',
                data: '[[(hello)]] what is happening [[\\[\\[world\\]\\]]]',
                links: [link1, link2]
            };

            const { id } = store.createNewBlock(root, { content });

            const block = store.getBlock(id);

            assertPresent(block);

            const { id: newBlockID } = store.createNewBlock(id, {
                split: { prefix: '[[(hello)]] what is happening', suffix: ' [[\\[\\[world\\]\\]]]' }
            });

            const oldBlock = store.getBlock(id);
            const newBlock = store.getBlock(newBlockID);

            assertPresent(oldBlock);
            assertPresent(newBlock);

            assert.deepEqual(oldBlock.content.links, [link1]);
            assert.deepEqual(newBlock.content.links, [link2]);
        });
    });

    describe("blocksToBlockContentStructure", () => {
        it("should convert the ids of blocks (including their children) to a content structure", () => {
            const store = createStore();

            const output = store.createBlockContentStructure(['102']);

            const block102 = store.getBlockForMutation('102');
            const block103 = store.getBlockForMutation('103');
            const block104 = store.getBlockForMutation('104');
            const block116 = store.getBlockForMutation('116');
            const block105 = store.getBlockForMutation('105');
            const block106 = store.getBlockForMutation('106');
            const block117 = store.getBlockForMutation('117');
            const block118 = store.getBlockForMutation('118');

            assertPresent(block102);
            assertPresent(block103);
            assertPresent(block104);
            assertPresent(block116);
            assertPresent(block105);
            assertPresent(block106);
            assertPresent(block117);
            assertPresent(block118);
            assertBlockType('markdown', block103);
            assertBlockType('markdown', block104);
            assertBlockType('markdown', block116);
            assertBlockType('markdown', block105);
            assertBlockType('markdown', block106);
            assertBlockType('markdown', block117);
            assertBlockType('markdown', block118);

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

            store.setActive(id);
            const blockIDs = Array.from({ length: 12 }).map(() => Hashcodes.createRandomID());

            createUndoRunner(store, ['112', ...blockIDs], () => {
                store.insertFromBlockContentStructure(blockStructure, {blockIDs});
                const block102 = store.getBlockForMutation(id);
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
                    const block = store.getBlockForMutation(blockID);
                    assertPresent(block);
                    assertBlockType('markdown', block);
                    assert.equal(block.content.data, content[i]);
                });

                const secondBlock = store.getBlockForMutation(items[1]);
                assertPresent(secondBlock);

                const level1Child1 = store.getBlockForMutation(secondBlock.itemsAsArray[0]);
                assertPresent(level1Child1);
                assertBlockType('markdown', level1Child1);
                assert.equal(level1Child1.content.data, "hmm");

                const level2Child2 = store.getBlockForMutation(secondBlock.itemsAsArray[1]);
                assertPresent(level2Child2);
                assertBlockType('markdown', level2Child2);
                assert.equal(level2Child2.content.data, "world");

                const level3Child = store.getBlockForMutation(level2Child2.itemsAsArray[0]);
                assertPresent(level3Child);
                assertBlockType('markdown', level3Child);
                assert.equal(level3Child.content.data, "potato");
            });
        });
    });

    describe('relatedTagsManager', () => {
        it('should update the relatedTagsManager index properly when blocks with tags are created', () => {
            const store = createStore();

            const content = new NameContent({
                type: 'name',
                data: 'Microsoft',
                links: [{ id: '102', text: 'World War II' }, { id: '108', text: '#Russia' }, { id: '108', text: '#Russia' }],
            });

            store.createNewNamedBlock({ content, newBlockID: '999' });

            const relatedTags = store.relatedTagsManager.compute(['Microsoft']);
            assert.deepEqual(relatedTags, [{ tag: 'Russia', hits: 2 }]);
        });

        it('should update the relatedTagsManager index properly when blocks with tags are updated/deleted', () => {
            const store = createStore();

            const content = new NameContent({
                type: 'name',
                data: 'Microsoft',
                links: [{ id: '102', text: 'World War II' }, { id: '108', text: '#Russia' }],
            });

            const newNamedBlockID = store.createNewNamedBlock({ content });

            const markdownContent1 = new MarkdownContent({
                type: 'markdown',
                data: 'hello',
                links: [{ id: '102', text: 'World War II' }, { id: '108', text: '#Korea' }],
            });

            store.createNewBlock(newNamedBlockID, { content: markdownContent1 });

            const markdownContent2 = new MarkdownContent({
                type: 'markdown',
                data: 'hello',
                links: [{ id: '102', text: 'World War II' }, { id: '108', text: '#Korea' }],
            });

            const { id: markdownBlock2ID } = store.createNewBlock(newNamedBlockID, { content: markdownContent2 });

            const updatedMarkdownContent = {
                ...markdownContent2.toJSON(),
                links: [
                    ...markdownContent2.toJSON().links,
                    { id: '102', text: '#Russia' },
                    { id: '108', text: '#Korea' },
                    { id: '108', text: '#Korea' },
                ],
            };

            store.setBlockContent(markdownBlock2ID, updatedMarkdownContent);

            const relatedTags = store.relatedTagsManager.compute(['Microsoft']);

            assert.deepEqual(relatedTags, [
                { tag: 'Korea', hits: 4 },
                { tag: 'Russia', hits: 2 },
            ]);
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
