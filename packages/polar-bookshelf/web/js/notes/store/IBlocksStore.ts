import {IBlockActivated, NavOpts, NavPosition, BlockIDStr, StringSetMap} from "./BlocksStore";
import {IBlock} from "./IBlock";
import {Block} from "./Block";
import {BlockTargetStr} from "../NoteLinkLoader";

export interface IBlocksStore {

    selected: StringSetMap;

    clearSelected(reason: string): void;

    lookup(notes: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock>;
    lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr>;
    pathToNote(id: BlockIDStr): ReadonlyArray<Block>;

    doDelete(noteIDs: ReadonlyArray<BlockIDStr>): void;
    setActive(active: BlockIDStr | undefined): void;

    setRoot(root: BlockIDStr | undefined): void;

    getNoteByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined;

    getNoteActivated(id: BlockIDStr): IBlockActivated | undefined;

    getNote(id: BlockIDStr): Block | undefined;

    setActiveWithPosition(active: BlockIDStr | undefined,
                          activePos: NavPosition | undefined): void;

}
