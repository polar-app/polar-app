import React from 'react';
import {IBlocksStore} from "../store/IBlocksStore";
import {BlockIDStr} from "../store/BlocksStore";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutationRemoved = BlocksStoreMutations.IBlocksStoreMutationRemoved;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import {IBlock} from "../store/IBlock";
import {useBlocksPersistenceWriter} from "./BlockPersistenceWriters";
import IBlocksStoreMutationUpdated = BlocksStoreMutations.IBlocksStoreMutationModified;
import IBlocksStoreMutationAdded = BlocksStoreMutations.IBlocksStoreMutationAdded;
import { Block } from '../store/Block';

export type AsyncCommitCallback = () => Promise<void>;

export interface IBlocksStoreMutationsHandler {
    readonly handleDelete: (blocksStore: IBlocksStore, blockIDs: ReadonlyArray<BlockIDStr>) => AsyncCommitCallback;
    readonly handlePut: (blocksStore: IBlocksStore, blocks: ReadonlyArray<IBlock>) => AsyncCommitCallback;
}

export function createMockBlocksStoreMutationsHandler(): IBlocksStoreMutationsHandler {

    const handleDelete = (blocksStore: IBlocksStore, blockIDs: ReadonlyArray<BlockIDStr>) => {

        return async () => {
            console.log("notes: mock persistence: handleDelete: ", blockIDs)
        }

    }
    const handlePut = (blocksStore: IBlocksStore, blocks: ReadonlyArray<IBlock>) => {

        return async () => {
            console.log("notes: mock persistence: handlePut: ", blocks)
        }

    }

    return {
        handleDelete, handlePut
    }
}

export function useBlocksStoreMutationsHandler(): IBlocksStoreMutationsHandler {

    const writer = useBlocksPersistenceWriter();

    const handleDelete = React.useCallback((blocksStore: IBlocksStore, blockIDs: ReadonlyArray<BlockIDStr>): AsyncCommitCallback => {

        function toMutation(block: IBlock): IBlocksStoreMutationRemoved {
            return {
                id: block.id,
                type: 'removed',
                removed: block,
            };
        }

        const mutations: ReadonlyArray<IBlocksStoreMutationRemoved> =
            arrayStream(blockIDs)
                .map(current => blocksStore.getBlock(current))
                .filterPresent()
                .map(current => current.toJSON())
                .map(current => toMutation(current))
                .collect()

        return async () => {
            await writer(mutations);
        }

    }, [writer]);

    const handlePut = React.useCallback((blocksStore: IBlocksStore, blocks: ReadonlyArray<IBlock>): AsyncCommitCallback => {

        // FIXME: the undo system to just work with the persistence system... That is the problem here...
        // FIXME: this is the problem because I think we need to capture the blocks before and after...

        const toExternalBlock = (block: IBlock) => {

            if ((block as any).toJSON) {
                return (block as Block).toJSON()
            }

            return block
        }


        function toMutation(before: IBlock | undefined, after: IBlock): IBlocksStoreMutationUpdated | IBlocksStoreMutationAdded {

            if (before === undefined) {
                return {
                    id: after.id,
                    type: 'added',
                    added: after,
                }
            } else {
                return {
                    id: after.id,
                    type: 'modified',
                    before,
                    after
                }
            }

        }

        const snapshot = blocks.map(current => toExternalBlock(current));

        return async () => {

            const mutations: ReadonlyArray<IBlocksStoreMutationUpdated | IBlocksStoreMutationAdded> =
                arrayStream(snapshot)
                    .map(before => {
                        const after = blocksStore.getBlock(before.id)?.toJSON();
                        return toMutation(before, after!);
                    })
                    .collect()

            await writer(mutations);
        }

    }, [writer]);

    return {handleDelete, handlePut}

}
