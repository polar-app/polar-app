import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";

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
