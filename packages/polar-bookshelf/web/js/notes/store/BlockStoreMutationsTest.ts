import {IMarkdownContent} from "../content/IMarkdownContent";
import {PositionalArrays} from "./PositionalArrays";
import {assertJSON} from "../../test/Assertions";
import {BlockStoreTests} from "./BlockStoreTests";
import createBasicBlock = BlockStoreTests.createBasicBlock;
import {BlockStoreMutations} from "./BlockStoreMutations";

describe('BlockStoreMutations', () => {

    describe("computeMutationTargets", () => {

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

            assertJSON(BlockStoreMutations.computeMutationTargets(before, after), ['items']);

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

            assertJSON(BlockStoreMutations.computeMutationTargets(before, after), ['content']);

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

            assertJSON(BlockStoreMutations.computeMutationTargets(before, after), ['items', 'content']);

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

            assertJSON(BlockStoreMutations.computeMutationTargets(before, after), []);

        });

    });
    describe("computeItemPositionPatches", () => {

        it("remove", () => {

            assertJSON(BlockStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create([])), [
                {
                    "type": "remove",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlockStoreMutations.computeItemPositionPatches(PositionalArrays.create([]), PositionalArrays.create(['1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {

            assertJSON(BlockStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['1', '2'])), [
                {
                    "type": "insert",
                    "key": "2",
                    "id": "2"
                }
            ]);

        });


        it("insert before", () => {

            assertJSON(BlockStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create(['2', '1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "2"
                }
            ]);

        });


    });


});
