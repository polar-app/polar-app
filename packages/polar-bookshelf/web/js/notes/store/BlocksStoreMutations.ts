import deepEqual from "deep-equal";
import {PositionalArrays} from "./PositionalArrays";
import {SetArrays} from "polar-shared/src/util/SetArrays";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";

export namespace BlocksStoreMutations {

    import PositionalArrayPositionStr = PositionalArrays.PositionalArrayPositionStr;
    import PositionalArray = PositionalArrays.PositionalArray;

    export type BlockUpdateMutationType = 'added' | 'removed' | 'modified';

    export interface IBlocksStoreMutationAdded {
        readonly id: BlockIDStr;
        readonly type: 'added';

        readonly added: IBlock;

    }

    export interface IBlocksStoreMutationRemoved {

        readonly id: BlockIDStr;
        readonly type: 'removed';

        readonly removed: IBlock;

    }
    export interface IBlocksStoreMutationModified {
        readonly id: BlockIDStr;
        readonly type: 'modified';
        readonly before: IBlock;
        readonly after: IBlock;
    }

    export type IBlocksStoreMutation = IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved | IBlocksStoreMutationModified;


    /**
     *
     * The mutation types:
     *
     * - items: the items were changes which means that we have to issue a patch
     *          to undo it to avoid conflicting with another users edits on the
     *          children.
     *
     * - content: the content was changed.
     *
     * - items-and-content: both the items and content were changed.
     *
     */
    export type MutationTarget = 'items' | 'content' | 'parent' | 'parents';

    /**
     * Given a before block, and an after block, compute the mutations that were
     * performed on the content.
     */
    export function computeMutationTargets(before: IBlock, after: IBlock): ReadonlyArray<MutationTarget> {

        if (before.mutation === after.mutation) {
            console.warn("computeMutationTargets: both before and after blocks at same mutation level");
        }

        const result: MutationTarget[] = [];

        if (! deepEqual(before.items, after.items)) {
            result.push('items');
        }

        if (! deepEqual(before.content, after.content)) {
            result.push('content');
        }

        if (! deepEqual(before.parents, after.parents)) {
            result.push('parents');
        }

        if (before.parent !== after.parent) {
            result.push('parent');
        }

        return result;

    }


    /**
     * Instruction to remove and item from the items.
     */
    export interface IItemsPositionPatchRemove {
        readonly type: 'remove';
        readonly key: PositionalArrayPositionStr;
        readonly id: BlockIDStr;
    }

    export interface IItemsPositionPatchInsert {
        readonly type: 'insert';
        readonly key: PositionalArrayPositionStr;
        readonly id: BlockIDStr
    }

    export type IItemsPositionPatch = IItemsPositionPatchRemove | IItemsPositionPatchInsert;

    // TODO: Why did we go with the exact remove/insert model? I think this is
    // actually wrong because if we undo/redo it's better to have the position
    // in the tree to avoid a collision with another edit.
    export function computeItemPositionPatches(before: PositionalArray<BlockIDStr>,
                                               after: PositionalArray<BlockIDStr>): ReadonlyArray<IItemsPositionPatch> {

        const removed = SetArrays.differenceDeep(PositionalArrays.entries(before), PositionalArrays.entries(after));
        const added = SetArrays.differenceDeep(PositionalArrays.entries(after), PositionalArrays.entries(before));
        const toPatch = (type: 'remove' | 'insert') => ([key, id]: [string, string]): IItemsPositionPatch => ({
            type,
            key,
            id
        });

        return [
            ...removed.map(toPatch('remove')),
            ...added.map(toPatch('insert')),
        ];

    }

}
