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

export function useBlocksDeleteHandler() {

    const writer = useBlocksPersistenceWriter();

    return React.useCallback(async (blocksStore: IBlocksStore, blockIDs: ReadonlyArray<BlockIDStr>) => {

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

        await writer(mutations);

    }, [writer]);

}

export function useBlocksPutHandler() {

    const writer = useBlocksPersistenceWriter();

    return React.useCallback(async (blocksStore: IBlocksStore, blocks: ReadonlyArray<IBlock>) => {

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
                .map(current => {
                    const before = blocksStore.getBlock(current.id)?.toJSON();
                    return toMutation(before, current);
                })
                .collect()

        await writer(mutations);

    }, [writer]);

}
