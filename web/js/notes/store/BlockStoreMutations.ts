import {BlockIDStr} from "./BlocksStore";
import {IBlock} from "./IBlock";

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

}
