import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {assertJSON} from "../../test/Assertions";
import {IBlock, IBlockLink} from "./IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockIDStr, BlocksStore, IBlockContent} from "./BlocksStore";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IMarkdownContent} from "../content/IMarkdownContent";
import {assert} from 'chai';
import {MockBlocks} from "../../../../apps/stories/impl/MockBlocks";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {JSDOMParser} from "./BlocksStoreTest";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {PositionalArrays} from "./PositionalArrays";
import PositionalArray = PositionalArrays.PositionalArray;
import IBlocksStoreMutation = BlocksStoreUndoQueues.IBlocksStoreMutation;

interface IBasicBlockOpts<C> {
    readonly id?: BlockIDStr;
    readonly root: BlockIDStr;
    readonly parent?: BlockIDStr;
    readonly content: C;
    readonly items?: PositionalArray<BlockIDStr>;
    readonly links?: PositionalArray<IBlockLink>;
    readonly mutation?: number;
}
function createBasicBlock<C extends IBlockContent = IBlockContent>(opts: IBasicBlockOpts<C>): IBlock<C> {

    const nspace = '234'
    const uid = '1234'
    const created = ISODateTimeStrings.create();

    return {
        id: opts.id || Hashcodes.createRandomID(),
        nspace,
        uid,
        created,
        updated: created,
        ...opts,
        root: opts.root,
        parent: opts.parent || undefined,
        items: opts.items || {},
        links: opts.links || {},
        mutation: opts.mutation || 0
    }

}

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
    content: {
        type: 'name',
        data: "United States"
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
                "type": "updated",
                "before": {
                    "id": "104",
                    "nspace": "ns101",
                    "uid": "123",
                    "root": "100",
                    "parent": "102",
                    "created": "2012-03-02T11:38:49.321Z",
                    "updated": "2012-03-02T11:38:49.321Z",
                    "items": {},
                    "content": {
                        "type": "markdown",
                        "data": "Axis Powers: Germany, Italy, Japan"
                    },
                    "links": {},
                    "mutation": 0
                },
                "after": {
                    "id": "104",
                    "nspace": "ns101",
                    "uid": "123",
                    "root": "100",
                    "parent": "102",
                    "created": "2012-03-02T11:38:49.321Z",
                    "updated": "2012-03-02T11:38:49.321Z",
                    "items": {},
                    "content": {
                        "type": "markdown",
                        "data": "Axis "
                    },
                    "links": {},
                    "mutation": 1
                }
            };

            const blocksStore = createStore();

            blocksStore.doPut([mutation0.after]);

            BlocksStoreUndoQueues.doMutations(blocksStore, 'undo', [mutation0]);

            assertJSON(mutation0.before, blocksStore.getBlock('104')?.toJSON())

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
                content: {
                    type: 'markdown',
                    data: 'static block',
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const removedBlock = createBasicBlock<IMarkdownContent>({
                id: '0x02',
                root: "100",
                content: {
                    type: 'markdown',
                    data: 'removed block',
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
                    content: {
                        type: 'markdown',
                        data: 'updated block',
                    },
                    items: PositionalArrays.create(['1', '2'])
                }),
            ];

            TestingTime.forward(1000);

            const addedBlock = createBasicBlock<IMarkdownContent>({
                id: '0x03',
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'added block',
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
                    content: {
                        type: 'markdown',
                        data: 'updated block 2',
                    },
                    items: PositionalArrays.create(['1', '2']),
                    mutation: 1
                }),

            ];

            const mutatedBlocks = BlocksStoreUndoQueues.computeMutatedBlocks(beforeBlocks, afterBlocks);

            assertJSON(mutatedBlocks, [
                {
                    "id": "0x03",
                    "before": {
                        "id": "0x03",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:50.321Z",
                        "updated": "2012-03-02T11:38:50.321Z",
                        "root": "100",
                        "parent": "100",
                        "content": {
                            "type": "markdown",
                            "data": "added block"
                        },
                        "items": {
                            "1": "1",
                            "2": "2"
                        },
                        "links": {},
                        "mutation": 0
                    },
                    "type": "added"
                },
                {
                    "id": "0x02",
                    "before": {
                        "id": "0x02",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:49.321Z",
                        "updated": "2012-03-02T11:38:49.321Z",
                        "root": "100",
                        "content": {
                            "type": "markdown",
                            "data": "removed block"
                        },
                        "items": {
                            "1": "1",
                            "2": "2"
                        },
                        "links": {},
                        "mutation": 0
                    },
                    "type": "removed"
                },
                {
                    "id": "0x04",
                    "type": "updated",
                    "before": {
                        "id": "0x04",
                        "nspace": "234",
                        "uid": "1234",
                        "created": "2012-03-02T11:38:49.321Z",
                        "updated": "2012-03-02T11:38:49.321Z",
                        "root": "100",
                        "parent": "100",
                        "content": {
                            "type": "markdown",
                            "data": "updated block"
                        },
                        "items": {
                            "1": "1",
                            "2": "2"
                        },
                        "links": {},
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
                        "content": {
                            "type": "markdown",
                            "data": "updated block 2"
                        },
                        "items": {
                            "1": "1",
                            "2": "2"
                        },
                        "mutation": 1,
                        "links": {}
                    }
                }
            ]);

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
                "106"
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

        it(' child off root with few children', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['105']);

            assertJSON(identifiers, [
                "102",
                "105",
                "106"
            ]);

        });

        it(' child with parent but parent is not root', () => {

            const blocksStore = createStore();

            const identifiers = BlocksStoreUndoQueues.expandToParentAndChildren(blocksStore, ['106']);

            assertJSON(identifiers, [
                "105",
                "106"
            ]);

        });


    });

    describe("computeMutationType", () => {

        it("items", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world',
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2', '3'])
            });

            assertJSON(BlocksStoreUndoQueues.computeMutationTargets(before, after), ['items']);

        });

        it("content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world'
                }
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                }
            });

            assertJSON(BlocksStoreUndoQueues.computeMutationTargets(before, after), ['content']);

        });

        it("items-and-content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                },
                items: PositionalArrays.create(['1', '2', '3'])

            });

            assertJSON(BlocksStoreUndoQueues.computeMutationTargets(before, after), ['items', 'content']);

        });

        it("no mutation", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: PositionalArrays.create(['1', '2'])

            });

            assertJSON(BlocksStoreUndoQueues.computeMutationTargets(before, after), []);

        });

    });

    describe("computeItemPositionPatches", () => {

        it("remove", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create([])), [
                {
                    "type": "remove",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemPositionPatches(PositionalArrays.create([]), PositionalArrays.create(['1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['1', '2'])), [
                {
                    "type": "insert",
                    "key": "2",
                    "id": "2"
                }
            ]);

        });


        it("insert before", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['2', '1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "2"
                }
            ]);

        });


    });

});
