import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {assertJSON} from "polar-test/src/test/Assertions";
import {BlocksStore} from "./BlocksStore";
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {assertBlockType, JSDOMParser} from "./BlocksStoreTestNK";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {BlocksStoreTests} from "./BlocksStoreTests";
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {assert} from "chai";
import {Asserts} from "polar-shared/src/Asserts";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {AreaHighlightAnnotationContent, TextHighlightAnnotationContent} from "../content/AnnotationContent";
import {AnnotationContentType} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {JSDOM} from "jsdom";
import createBasicBlock = BlocksStoreTests.createBasicBlock;
import IBlocksStoreMutation = BlocksStoreMutations.IBlocksStoreMutation;

function createStore() {
    const blocks = MockBlocks.create();
    const store = new BlocksStore('1234', UndoQueues2.create({limit: 50}));
    store.doPut(blocks);
    return store;
}

const root = createBasicBlock({
    id: '100',
    root: '100',
    parent: undefined,
    parents: [],
    content: {
        type: 'name',
        data: "United States",
        links: [],
    }
})

describe("BlocksStoreUndoQueues", () => {

    describe("doMutations", () => {

        // we should test the undo/redo code directly here...
        // TODO: that content is not restored when the mutation is updated
        // TODO: that content and items works but the items are not restored

        it("undo/redo mutation block", () => {

            const mutation0: IBlocksStoreMutation = {
                "id": "104",
                "type": "modified",
                "before": {
                    "id": "104",
                    "nspace": "ns101",
                    "uid": "123",
                    "root": "100",
                    "parent": "102",
                    "parents": ["102"],
                    "created": "2012-03-02T11:38:49.321Z",
                    "updated": "2012-03-02T11:38:49.321Z",
                    "items": {},
                    "content": {
                        "type": "markdown",
                        "data": "Axis Powers: Germany, Italy, Japan",
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "links": [],
                    },
                    "mutation": 0
                },
                "after": {
                    "id": "104",
                    "nspace": "ns101",
                    "uid": "123",
                    "root": "100",
                    "parent": "102",
                    "parents": ["102"],
                    "created": "2012-03-02T11:38:49.321Z",
                    "updated": "2012-03-02T11:38:49.321Z",
                    "items": {},
                    "content": {
                        "type": "markdown",
                        "data": "Axis ",
                        "mutator": DeviceIDManager.TEST_DEVICE_ID,
                        "links": [],
                    },
                    "mutation": 1
                }
            };

            const blocksStore = createStore();

            blocksStore.doPut([mutation0.after]);

            BlocksStoreUndoQueues.doMutations(blocksStore, 'undo', [mutation0]);

            assertJSON({ ...mutation0.before, mutation: 2 }, blocksStore.getBlockForMutation('104')?.toJSON())

        });

    });

    describe("computeMutatedBlocks", () => {

        beforeEach(() => {
            console.log("Freezing time...");
            TestingTime.freeze()
            JSDOMParser.makeGlobal();
        });

        afterEach(() => {
            console.log("Unfreezing time...");
            TestingTime.unfreeze();
        });

        it('basic', () => {

            const staticBlock = createBasicBlock<IMarkdownContent>({
                id: '0x01',
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'static block',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const removedBlock = createBasicBlock<IMarkdownContent>({
                id: '0x02',
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'removed block',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const beforeBlocks = [
                staticBlock,
                removedBlock,
                createBasicBlock<IMarkdownContent>({
                    id: '0x04',
                    root: "100",
                    parent: "100",
                    parents: ["100"],
                    content: {
                        type: 'markdown',
                        data: 'updated block',
                        links: [],
                    },
                    items: PositionalArrays.create(['1', '2'])
                }),
            ];

            TestingTime.forward(1000);

            const addedBlock = createBasicBlock<IMarkdownContent>({
                id: '0x03',
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'added block',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });


            const afterBlocks = [
                staticBlock,
                addedBlock,
                createBasicBlock<IMarkdownContent>({
                    id: '0x04',
                    root: "100",
                    parent: "100",
                    parents: ["100"],
                    content: {
                        type: 'markdown',
                        data: 'updated block 2',
                        links: [],
                    },
                    items: PositionalArrays.create(['1', '2']),
                    mutation: 1
                }),

            ];

            const mutatedBlocks = BlocksStoreUndoQueues.computeMutatedBlocks(beforeBlocks, afterBlocks);

            assertJSON(mutatedBlocks, [
                {
                    "id": "0x03",
                    "type": "added",
                    "added": {
                        "id": "0x03",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:50.321Z",
                        "updated": "2012-03-02T11:38:50.321Z",
                        "root": "100",
                        "parent": "100",
                        "parents": [
                            "100"
                        ],
                        "content": {
                            "type": "markdown",
                            "data": "added block",
                            "links": [],
                        },
                        "items": PositionalArrays.create([
                            "1",
                            "2"
                        ]),
                        "mutation": 0
                    }
                },
                {
                    "id": "0x02",
                    "type": "removed",
                    "removed": {
                        "id": "0x02",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:49.321Z",
                        "updated": "2012-03-02T11:38:49.321Z",
                        "root": "100",
                        "parent": "100",
                        "parents": [
                            "100"
                        ],
                        "content": {
                            "type": "markdown",
                            "data": "removed block",
                            "links": [],
                        },
                        "items": PositionalArrays.create([
                            "1",
                            "2"
                        ]),
                        "mutation": 0
                    }
                },
                {
                    "id": "0x04",
                    "type": "modified",
                    "before": {
                        "id": "0x04",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:49.321Z",
                        "updated": "2012-03-02T11:38:49.321Z",
                        "root": "100",
                        "parent": "100",
                        "parents": [
                            "100"
                        ],
                        "content": {
                            "type": "markdown",
                            "data": "updated block",
                            "links": [],
                        },
                        "items": PositionalArrays.create([
                            "1",
                            "2"
                        ]),
                        "mutation": 0
                    },
                    "after": {
                        "id": "0x04",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:50.321Z",
                        "updated": "2012-03-02T11:38:50.321Z",
                        "root": "100",
                        "parent": "100",
                        "parents": [
                            "100"
                        ],
                        "content": {
                            "type": "markdown",
                            "data": "updated block 2",
                            "links": [],
                        },
                        "items": PositionalArrays.create([
                            "1",
                            "2"
                        ]),
                        "mutation": 1,
                    }
                }
            ]);

        });

    });

    describe("getSideEffectIdentifiers", () => {

        it('should return the id of the parent document block when given a descendant of that block', () => {
            const blocksStore = createStore();

            const sideEffectIdentifiers = BlocksStoreUndoQueues.getAffectedDocumentBlocksIdentifiers(blocksStore, ['2024', '2023flashcard']);

            assert.deepEqual(sideEffectIdentifiers, ['2020document']);
        });

        it('should ignore root types other than "document"', () => {
            const blocksStore = createStore();

            const sideEffectIdentifiers = BlocksStoreUndoQueues.getAffectedDocumentBlocksIdentifiers(blocksStore, ['111', '118']);

            assert.deepEqual(sideEffectIdentifiers, []);
        });

    });

    describe("performSideEffects", () => {
        beforeEach(() => {
            TestingTime.freeze();
            const dom = new JSDOM('<html><body></body></html>');

            global.document = dom.window.document;
        });

        afterEach(() => {
            TestingTime.unfreeze();
        });

        it('should update the timestamp of the given blocks', () => {
            const blocksStore = createStore();
            const id = '2020document';

            const block = blocksStore.getBlockForMutation(id);

            Asserts.assertPresent(block);

            const timeDiffMs = 1000 * 60 * 2; // 2 mins

            TestingTime.forward(timeDiffMs);

            BlocksStoreUndoQueues.performDocumentSideEffects(
                blocksStore,
                ['2020document'],
                []
            );

            const updatedBlock = blocksStore.getBlockForMutation(id);

            Asserts.assertPresent(updatedBlock);

            const updatedTime = ISODateTimeStrings.create((new Date(block.updated).getTime()) + timeDiffMs);

            assert.equal(updatedBlock.updated, updatedTime);
        });

        it('should ignore timestamp updates that are within a timeframe of less than 1 minute', () => {
            const blocksStore = createStore();
            const id = '2020document';

            const block = blocksStore.getBlockForMutation(id);

            Asserts.assertPresent(block);

            const timeDiffMs = 1000 * 30; // 30 secs

            TestingTime.forward(timeDiffMs);

            BlocksStoreUndoQueues.performDocumentSideEffects(
                blocksStore,
                ['2020document'],
                []
            );

            const updatedBlock = blocksStore.getBlockForMutation(id);

            Asserts.assertPresent(updatedBlock);

            const updatedTime = ISODateTimeStrings.create((new Date(block.updated).getTime()));

            assert.equal(updatedBlock.updated, updatedTime);
        });



        it('should update the counters of docInfo when a child gets added', () => {
            // Set up
            const blocksStore = createStore();
            const documentBlockID = '2020document';

            const content = new TextHighlightAnnotationContent({
                type: AnnotationContentType.TEXT_HIGHLIGHT,
                links: [],
                docID: '2020document',
                pageNum: 11,
                value: {
                    text: 'hello world',
                    color: 'yellow',
                    rects: {},
                    revisedText: 'erm'
                }
            });

            const { id: blockID } = blocksStore.createNewBlock(documentBlockID, { content });
            const block = blocksStore.getBlock(blockID);

            Asserts.assertPresent(block);
            const blockJSON = block.toJSON();

            const mutations: ReadonlyArray<IBlocksStoreMutation> = [{
                type: 'added',
                id: blockID,
                added: blockJSON,
            }];

            const oldOwnerDocumentBlock = blocksStore.getBlockForMutation(documentBlockID);
            Asserts.assertPresent(oldOwnerDocumentBlock);
            assertBlockType('document', oldOwnerDocumentBlock);
            const oldDocInfo = oldOwnerDocumentBlock.content.toJSON().docInfo;


            // Act
            BlocksStoreUndoQueues.performDocumentSideEffects(blocksStore, [documentBlockID], mutations);


            // Assert
            const ownerDocumentBlock = blocksStore.getBlockForMutation(documentBlockID);
            Asserts.assertPresent(ownerDocumentBlock);
            assertBlockType('document', ownerDocumentBlock);

            const newDocInfo = ownerDocumentBlock.content.toJSON().docInfo;

            assert.equal(newDocInfo.nrTextHighlights, (oldDocInfo.nrTextHighlights || 0) + 1, 'nrTextHighlights should have the correct number');
            assert.equal(newDocInfo.nrAnnotations, (oldDocInfo.nrAnnotations || 0) + 1, 'nrAnnotations should have the correct number');
        });

        it('should update the counters of docInfo when a child gets removed (it should also ignore mutations of type "modified")', () => {
            // Set up
            const blocksStore = createStore();
            const documentBlockID = '2020document';
            const randomBlock = blocksStore.getBlock('102');
            Asserts.assertPresent(randomBlock);

            const content = new AreaHighlightAnnotationContent({
                type: AnnotationContentType.AREA_HIGHLIGHT,
                links: [],
                docID: '2020document',
                pageNum: 11,
                value: {
                    color: 'yellow',
                    rects: {},
                }
            });

            const { id: blockID } = blocksStore.createNewBlock(documentBlockID, { content });
            const block = blocksStore.getBlock(blockID);

            Asserts.assertPresent(block);
            const blockJSON = block.toJSON();

            const mutations: ReadonlyArray<IBlocksStoreMutation> = [
                {
                    type: 'removed',
                    id: blockID,
                    removed: blockJSON,
                },
                {
                    type: 'modified',
                    id: randomBlock.id,
                    before: randomBlock.toJSON(),
                    after: randomBlock.toJSON(),
                }
            ];

            const oldOwnerDocumentBlock = blocksStore.getBlockForMutation(documentBlockID);
            Asserts.assertPresent(oldOwnerDocumentBlock);
            assertBlockType('document', oldOwnerDocumentBlock);
            const oldDocInfo = oldOwnerDocumentBlock.content.toJSON().docInfo;


            // Act
            BlocksStoreUndoQueues.performDocumentSideEffects(blocksStore, [documentBlockID], mutations);


            // Assert
            const ownerDocumentBlock = blocksStore.getBlockForMutation(documentBlockID);
            Asserts.assertPresent(ownerDocumentBlock);
            assertBlockType('document', ownerDocumentBlock);

            const newDocInfo = ownerDocumentBlock.content.toJSON().docInfo;

            assert.equal(newDocInfo.nrAreaHighlights, (oldDocInfo.nrAreaHighlights || 0) - 1, 'nrAreaHighlights should have the correct number');
            assert.equal(newDocInfo.nrAnnotations, (oldDocInfo.nrAnnotations || 0) - 1, 'nrAnnotations should have the correct number');
        });
    });

    describe("expandToParentAndChildren", () => {

        it('single root and children', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['102']);

            assertJSON(identifiers, [
                "102",
                "103",
                "104",
                "105",
                "106",
                "116",
                "117",
                "118",
            ]);

        });

        it('first child off root with no children', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['103']);

            assertJSON(identifiers, [
                "102",
                "103",
            ]);

        });

        it('child off root with few children', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['105']);

            assertJSON(identifiers, [
                "102",
                "105",
                "106",
                "117",
                "118",
            ]);

        });

        it('child with parent but parent is not root', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['106']);

            assertJSON(identifiers, [
                "105",
                "106",
                "117",
                "118",
            ]);

        });


    });

});
