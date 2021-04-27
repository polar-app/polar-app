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

describe("BlocksStoreUndoQueues", () => {

    describe("expandToParentAndChildren", () => {

        function createStore() {
            const blocks = MockBlocks.create();
            const store = new BlocksStore('1234', UndoQueues2.create({limit: 50}));
            store.doPut(blocks);
            return store;
        }

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

        interface IBasicBlockOpts<C> {
            readonly parent?: BlockIDStr;
            readonly content: C;
            readonly items?: ReadonlyArray<BlockIDStr>;
            readonly links?: ReadonlyArray<IBlockLink>;
        }
        function createBasicBlock<C extends IBlockContent = IBlockContent>(opts: IBasicBlockOpts<C>): IBlock<C> {

            const id = Hashcodes.createRandomID();
            const nspace = '234'
            const uid = '1234'
            const created = ISODateTimeStrings.create();

            return {
                id,
                nspace,
                uid,
                created,
                updated: created,
                ...opts,
                parent: opts.parent || undefined,
                items: opts.items || [],
                links: opts.links || []
            }

        }

        it("items", () => {

            const before = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world',
                },
                items: ['1', '2']
            });

            const after = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: ['1', '2', '3']
            });

            assert.equal(BlocksStoreUndoQueues.computeMutationType(before, after), 'items');

        });

        it("content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world'
                }
            });

            const after = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                }
            });

            assert.equal(BlocksStoreUndoQueues.computeMutationType(before, after), 'content');

        });

        it("items-and-content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: ['1', '2']
            });

            const after = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world 2'
                },
                items: ['1', '2', '3']

            });

            assert.equal(BlocksStoreUndoQueues.computeMutationType(before, after), 'items-and-content');

        });

        it("no mutation", () => {

            const before = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: ['1', '2']
            });

            const after = createBasicBlock<IMarkdownContent>({
                content: {
                    type: 'markdown',
                    data: 'hello world'
                },
                items: ['1', '2']

            });

            assert.isUndefined(BlocksStoreUndoQueues.computeMutationType(before, after));

        });

    });


    describe("computeItemsPatch", () => {

        it("remove", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], []), [
                {
                    "type": "remove",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch([], ['1']), [
                {
                    "type": "unshift",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], ['1', '2']), [
                {
                    "type": "insert",
                    "ref": "1",
                    "id": "2",
                    "pos": "after"
                }
            ]);

        });


        it("insert before", () => {

            assertJSON(BlocksStoreUndoQueues.computeItemsPatch(['1'], ['2', '1']), [
                {
                    "type": "insert",
                    "ref": "1",
                    "id": "2",
                    "pos": "before"
                }
            ]);

        });


    });

});
