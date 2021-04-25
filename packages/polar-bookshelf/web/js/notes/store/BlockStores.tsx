import {IBlock} from "./IBlock";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {BlockIDStr, BlocksStore} from "./BlocksStore";
import {Block} from "./Block";

export namespace BlockStores {

    export interface IUndoMutation {
        readonly parent: IBlock | undefined;
        readonly child: IBlock;
    }

    export type BlockUpdateMutationType = 'updated' | 'added' | 'removed';

    export interface IBlocksStoreMutation {
        readonly type: BlockUpdateMutationType;
        readonly block: IBlock;
    }


    export interface IUndoCapture {
        readonly prepare: (snapshot: ReadonlyArray<Block>) => void;
        readonly capture: (snapshot: ReadonlyArray<Block>) => ReadonlyArray<IBlocksStoreMutation>;
    }

    export function createUndoCapture(identifiers: ReadonlyArray<BlockIDStr>): IUndoCapture {

        let prepared: boolean = false;

        let beforeBlocks: ReadonlyArray<IBlock> = [];

        /**
         * Computes only the blocks that are applicable to this operation.  We
         * have to know all the block IDs that would be involved with this
         * transaction.
         */
        const computeBlocks = (blocks: ReadonlyArray<Block>) => {

            return blocks.filter(block => identifiers.includes(block.id))
                         .map(block => block.toJSON());

        }

        const prepare = (snapshot: ReadonlyArray<Block>) => {

            prepared = true;
            beforeBlocks = computeBlocks(snapshot)

        };

        const capture = (snapshot: ReadonlyArray<Block>) => {

            if (! prepared) {
                throw new Error("Not prepared");
            }

            const afterBlocks = computeBlocks(snapshot);

            return computeUndoMutations(beforeBlocks, afterBlocks);

        }

        return {capture, prepare};

    }

    export function applyUndoMutations(blocksStore: BlocksStore, mutations: ReadonlyArray<IBlocksStoreMutation>) {

        const handleUpdated = (mutation: IBlocksStoreMutation) => {

            // updated means we need to restore it to the older version.

            const block = blocksStore.getBlock(mutation.block.id);

            if (! block) {
                throw new Error("Block mot currently in store: " + mutation.block.id)
            }

            block.set(mutation.block);

        }

        const handleAdded = (mutation: IBlocksStoreMutation) => {

            // added means we have to remove it now...

            if (blocksStore.containsBlock(mutation.block.id)) {
                blocksStore.doDelete([mutation.block.id]);
            } else {
                throw new Error("Block missing: " + mutation.block.id)
            }

        }

        const handleRemoved = (mutation: IBlocksStoreMutation) => {

            // added means we have to remove it now...

            if (! blocksStore.containsBlock(mutation.block.id)) {
                blocksStore.doPut([mutation.block]);
            } else {
                throw new Error("Block already exists: " + mutation.block.id)
            }

        }

        for(const mutation of mutations) {

            switch (mutation.type) {

                case "updated":
                    handleUpdated(mutation);
                    break;

                case "added":
                    handleAdded(mutation);
                    break;

                case "removed":
                    handleRemoved(mutation);
                    break;

            }

        }

    }

    export function computeUndoMutations(beforeBlocks: ReadonlyArray<IBlock>,
                                         afterBlocks: ReadonlyArray<IBlock>): ReadonlyArray<IBlocksStoreMutation> {

        const afterBlockIndex = arrayStream(afterBlocks).toMap();
        const beforeBlockIndex = arrayStream(beforeBlocks).toMap();

        const beforeBlockIDs = beforeBlocks.map(current => current.id);
        const afterBlockIDs = afterBlocks.map(current => current.id);

        const added = SetArrays.difference(afterBlockIDs, beforeBlockIDs)
                               .map(id => afterBlockIndex[id]);

        const removed = SetArrays.difference(beforeBlockIDs, afterBlockIDs)
                                 .map(id => beforeBlockIndex[id]);

        const computeUpdated = () => {

            const isUpdated = (beforeBlock: IBlock) => {

                const afterBlock = afterBlockIndex[beforeBlock.id];
                if ( afterBlock) {
                    return afterBlock.updated !== beforeBlock.updated;
                }

                return false;

            }

            return beforeBlocks.filter(isUpdated)

        }

        const updated = computeUpdated();

        const toMutation = (block: IBlock, type: BlockUpdateMutationType): IBlocksStoreMutation => {
            return {block, type};

        }

        return [
            ...updated.map(current => toMutation(current, 'updated')),
            ...added.map(current => toMutation(current, 'added')),
            ...removed.map(current => toMutation(current, 'removed'))
        ];

    }

}
