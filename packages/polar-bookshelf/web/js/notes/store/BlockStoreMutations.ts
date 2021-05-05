import {BlockIDStr} from "./BlocksStore";
import {IBlock} from "./IBlock";
import deepEqual from "deep-equal";

export namespace BlockStoreMutations {

    export type BlockUpdateMutationType = 'added' | 'removed' | 'updated';

    export interface IBlocksStoreMutationAdded {
        readonly id: BlockIDStr;
        readonly type: 'added';

        /**
         * The actual block added.
         */
        readonly before: IBlock;

    }

    export interface IBlocksStoreMutationRemoved {

        readonly id: BlockIDStr;
        readonly type: 'removed';

        /**
         * The actual block removed.
         */
        readonly before: IBlock;

    }
    export interface IBlocksStoreMutationUpdated {
        readonly id: BlockIDStr;
        readonly type: 'updated';
        readonly before: IBlock;
        readonly after: IBlock;
    }

    export type IBlocksStoreMutation = IBlocksStoreMutationAdded | IBlocksStoreMutationRemoved | IBlocksStoreMutationUpdated;


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
    export type MutationTarget = 'items' | 'content' | 'parent';

    /**
     * Given a before block, and an after block, compute the mutations that were
     * performed on the content.
     */
    export function computeMutationTargets(before: IBlock, after: IBlock): ReadonlyArray<MutationTarget> {

        const itemsMuted = ! deepEqual(before.items, after.items);
        const contentMuted = ! deepEqual(before.content, after.content);

        const result: MutationTarget[] = [];

        if (itemsMuted) {
            result.push('items');
        }

        if (contentMuted) {
            result.push('content');
        }

        if (before.parent !== after.parent) {
            result.push('parent');
        }

        return result;

    }


}
