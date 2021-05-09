import React from 'react';
import {IBlocksStore} from "../store/IBlocksStore";
import {BlockIDStr} from "../store/BlocksStore";
import {BlocksStoreMutations} from "../store/BlocksStoreMutations";
import IBlocksStoreMutationRemoved = BlocksStoreMutations.IBlocksStoreMutationRemoved;
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import {IBlock} from "../store/IBlock";
import {useBlocksPersistenceWriter} from "./BlockPersistenceProvider";
import IBlocksStoreMutationUpdated = BlocksStoreMutations.IBlocksStoreMutationUpdated;
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
                before: block
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
                    // TODO: this is a bug and should be called 'block'
                    before: after
                }
            } else {
                return {
                    id: after.id,
                    type: 'updated',
                    before, after
                }
            }

        }

        const mutations: ReadonlyArray<IBlocksStoreMutationUpdated | IBlocksStoreMutationAdded> =
            arrayStream(blocks)
                .map(current => toExternalBlock(current))
                .map(current => {
                    const before = blocksStore.getBlock(current.id)?.toJSON();
                    return toMutation(before, current);
                })
                .collect()

        return async () => {
            await writer(mutations);
        }

    }, [writer]);

    return {handleDelete, handlePut}

}
