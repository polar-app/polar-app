import {ReverseIndex} from "./ReverseIndex";
import {
    BlockIDStr,
    BlocksIndex,
    BlocksIndexByName,
    BlocksStore,
    IActiveBlock,
    IDropTarget,
    StringSetMap
} from "./BlocksStore";
import { IDStr } from "polar-shared/src/util/Strings";


//
// export interface IBlocksStoreUndoQueue {
//
//     readonly createSnapshot(): IBlocksStoreSnapshot;
// }
//
// export namespace BlocksStoreUndoQueue {
//
//     export function create(blocksStore: BlocksStore) {
//
//     }
//
// }
//
