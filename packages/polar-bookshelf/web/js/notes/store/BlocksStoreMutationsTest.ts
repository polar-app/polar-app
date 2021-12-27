import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {assertJSON} from "polar-test/src/test/Assertions";
import {BlocksStoreTests} from "./BlocksStoreTests/BlocksStoreTests";
import {BlocksStoreMutations} from "./BlocksStoreMutations";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import createBasicBlock = BlocksStoreTests.createBasicBlock;

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
                    "key": PositionalArrays.generateKey(1),
                    "id": "1"
                }
            ]);

        });

        it("unshift", () => {

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(PositionalArrays.create([]), PositionalArrays.create(['1'])), [
                {
                    "type": "insert",
                    "key": PositionalArrays.generateKey(1),
                    "id": "1"
                }
            ]);

        });

        it("insert after", () => {
            const current = PositionalArrays.create(['1']);
            const before = Dictionaries.deepCopy(current);


            PositionalArrays.insert(
                current,
                '1',
                '2',
                'after'
            );

            assertJSON(BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "insert",
                    "key": PositionalArrays.generateKey(2),
                    "id": "2"
                }
            ]);

        });


        it("insert before", () => {
            const current = PositionalArrays.create(['1']);
            const before = Dictionaries.deepCopy(current);

            PositionalArrays.insert(
                current,
                '1',
                '2',
                'before'
            );


            assertJSON(
                BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "insert",
                    "key": PositionalArrays.generateKey(0),
                    "id": "2"
                }
            ]);

        });

        it("Change position of an item", () => {
            const current = PositionalArrays.create(['1', '2', '3']);
            const before = Dictionaries.deepCopy(current);

            PositionalArrays.remove(
                current,
                '2',
            );

            PositionalArrays.insert(
                current,
                '3',
                '2',
                'after'
            );


            assertJSON(
                BlocksStoreMutations.computeItemPositionPatches(before, current), [
                {
                    "type": "remove",
                    "key": PositionalArrays.generateKey(2),
                    "id": "2"
                },
                {
                    "type": "insert",
                    "key": PositionalArrays.generateKey(4),
                    "id": "2"
                }
            ]);

        });

    });


});
