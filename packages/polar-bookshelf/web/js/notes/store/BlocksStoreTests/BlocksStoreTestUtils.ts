import {PositionalArrays} from "polar-shared/src/util/PositionalArrays";
import {Block} from "../Block";
import {BlockContent, BlockContentMap, BlocksStore} from "../BlocksStore";
import {MarkdownContent} from "../../content/MarkdownContent";
import {NameContent} from "../../content/NameContent";
import {assert} from "chai";
import {BlockIDStr, IBlock, IBlockLink} from "polar-blocks/src/blocks/IBlock";
import {Asserts} from "polar-shared/src/Asserts";
import {MockBlocks} from "../../../../../apps/stories/impl/MockBlocks";
import {UndoQueues2} from "../../../undo/UndoQueues2";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {IBlockTextHighlight} from "polar-blocks/src/annotations/IBlockTextHighlight";
import {IDocumentContent} from "polar-blocks/src/blocks/content/IDocumentContent";
import {AnnotationContentType, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";

export namespace BlockAsserts {
    export function assertTextBlock(content: BlockContent): asserts content is MarkdownContent | NameContent {

        if (content.type !== 'markdown' && content.type !== 'name') {
            throw new Error("wrong type: " + content.type);
        }

    }

    export function assertBlockType<T extends BlockContent['type']>(
            type: T,
            block: Readonly<Block>): asserts block is Block<BlockContentMap[T]> {

        if (block.content.type !== type) {
            throw new Error("wrong type: " + block.content.type);
        }

    }

    export function assertBlocksEqual(block1: IBlock, block2: IBlock) {
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

    export function assertBlockParents(store: BlocksStore, parents: ReadonlyArray<BlockIDStr>) {
        return (blockID: BlockIDStr) =>  {
            const block = store.getBlockForMutation(blockID);
            Asserts.assertPresent(block);
            assert.equal(block.parent, parents[parents.length - 1], `Block ${blockID} doesn't have the correct parent`);
            assert.deepEqual(block.parents, parents, `Block ${blockID} doesn't have the correct parents`);
            block.itemsAsArray.forEach(assertBlockParents(store, [...parents, block.id]));
        };
    }

    export function assertBlocksStoreSnapshotsEqual(
        snapshot1: ReadonlyArray<IBlock>,
        snapshot2: ReadonlyArray<IBlock>,
    ) {
        const toIds = (arr: ReadonlyArray<IBlock>) =>
            [...arr].sort((a, b) => a.id.localeCompare(b.id)).map(block => block.id);

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

    export type BlockTree = ReadonlyArray<{id: BlockIDStr,  children: BlockTree}>;

    export function assertBlockTree(store: BlocksStore, blockTree: BlockTree, parent?: Block) {

        for (const item of blockTree) {
            const block = store.getBlockForMutation(item.id);
            Asserts.assertPresent(block);

            if (parent) {
                assert.equal(block.parent, parent.id, `Block ${block.id} should have the correct parent`);
                assert.deepEqual(block.parents, [...parent.parents, parent.id], `Block ${block.id} should have the correct parents`);
            }

            assert.deepEqual(block.itemsAsArray, item.children.map(({id}) => id), `Block ${block.id} should have the correct items`);
            assertBlockTree(store, item.children, block);
        }

    }

}

export namespace BlocksStoreTestUtils {

    export function createStore() {
        const blocks = MockBlocks.create();
        const store = new BlocksStore('1234', UndoQueues2.create({ limit: 50 }));
        store.doPut(blocks);
        return store;
    }

    export function createDocumentContent(data?: Partial<IDocInfo>,
                                          links: ReadonlyArray<IBlockLink> = []): IDocumentContent {

        return {
            type: 'document',
            links,
            docInfo: {
                flagged: false,
                nrPages: 10,
                archived: false,
                progress: 5,
                properties: {},
                attachments: {},
                fingerprint: 'fingerprint',
                pagemarkType: PagemarkType.SINGLE_COLUMN,
                ...data,
            },
        };

    }

    export function createTextHighlightContent(data?: Partial<IBlockTextHighlight>,
                                               links: ReadonlyArray<IBlockLink> = []): ITextHighlightAnnotationContent {
        
        return {
            type: AnnotationContentType.TEXT_HIGHLIGHT,
            links,
            pageNum: 55,
            docID: `${Math.random()}`,
            value: {
                text: 'test',
                color: 'red',
                rects: {},
                ...data,
            },
        };

    }
}
