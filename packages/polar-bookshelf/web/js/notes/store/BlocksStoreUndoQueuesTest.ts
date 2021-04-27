import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {assertJSON} from "../../test/Assertions";
import {IBlock, IBlockLink} from "./IBlock";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {BlockIDStr, IBlockContent} from "./BlocksStore";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {IMarkdownContent} from "../content/IMarkdownContent";
import {assert} from 'chai';

describe("BlocksStoreUndoQueues", () => {

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
