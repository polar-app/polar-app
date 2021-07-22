import {PositionalArrays} from "./PositionalArrays";
import {assertJSON} from "../../test/Assertions";
import {BlocksStoreTests} from "./BlocksStoreTests";
import createBasicBlock = BlocksStoreTests.createBasicBlock;
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import {cloneDeep} from "lodash";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";

describe('BlocksStoreMutations', () => {

    describe("computeMutationTargets", () => {

        it("items", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2', '3'])
            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['items']);

        });

        it("content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                }
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world 2',
                    links: [],
                }
            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['content']);

        });

        it("items-and-content", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world 2',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2', '3'])

            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), ['items', 'content']);

        });

        it("no mutation", () => {

            const before = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])
            });

            const after = createBasicBlock<IMarkdownContent>({
                root: "100",
                parent: "100",
                parents: ["100"],
                content: {
                    type: 'markdown',
                    data: 'hello world',
                    links: [],
                },
                items: PositionalArrays.create(['1', '2'])

            });

            assertJSON(BlocksStoreMutations.computeMutationTargets(before, after), []);

        });

    });
    describe("computeItemPositionPatches", () => {

        it("remove", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create(['1']), PositionalArrays.create([])), [
                {
                    "type": "remove",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create([]), PositionalArrays.create(['1'])), [
                {
                    "type": "insert",
                    "key": "1",
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {
            const current = PositionalArrays.create(['1']);
            const before = cloneDeep(current);

            PositionalArrays.insert(
                current,
                PositionalArrays.keyForValue(before, '1'),
                '2',
                'after'
            );

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "insert",
                    "key": "2",
                    "id": "2"
                }
            ]);

        });


        it("insert before", () => {
            const current = PositionalArrays.create(['1']);
            const before = cloneDeep(current);

            PositionalArrays.insert(
                current,
                PositionalArrays.keyForValue(before, '1'),
                '2',
                'before'
            );


            assertJSON(
                BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "insert",
                    "key": "0",
                    "id": "2"
                }
            ]);

        });

        it("Change position of an item", () => {
            const current = PositionalArrays.create(['1', '2', '3']);
            const before = cloneDeep(current);

            PositionalArrays.remove(
                current,
                '2',
            );

            PositionalArrays.insert(
                current,
                PositionalArrays.keyForValue(before, '3'),
                '2',
                'after'
            );


            assertJSON(
                BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "remove",
                    "key": "2",
                    "id": "2"
                },
                {
                    "type": "insert",
                    "key": "4",
                    "id": "2"
                }
            ]);

        });

    });


});
