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


});
