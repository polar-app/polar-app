import {
    IBlockActivated,
    NavOpts,
    NavPosition,
    BlockIDStr,
    StringSetMap,
    DoIndentResult,
    DoUnIndentResult,
    ICreatedBlock,
    IActiveBlock,
    BlockNameStr,
    IBlockMerge,
    BlocksIndex,
    IDropTarget, INewBlockOpts, DoPutOpts, IBlockContent
} from "./BlocksStore";
import {IBlock} from "./IBlock";
import {Block} from "./Block";
import {BlockTargetStr} from "../NoteLinkLoader";
import {ReverseIndex} from "./ReverseIndex";
import {MarkdownStr} from "polar-shared/src/util/Strings";

/**
 * deleteBlocks
 * createNewBlock
 * createNewNamedBlock
 * collapse
 * expand
 * doIndent
 * doUnIndent
 * mergeBlocks
 */
export interface IBlocksStore {

    root: BlockIDStr | undefined;
    active: IActiveBlock | undefined;
    dropSource: BlockIDStr | undefined;
    dropTarget: IDropTarget | undefined;
    reverse: ReverseIndex;
    index: BlocksIndex;

    doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void;
    doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void;
    doCreateNewNamedBlock(name: BlockNameStr, ref: BlockIDStr): BlockIDStr;

    selected(): StringSetMap;
    selectedIDs(): ReadonlyArray<BlockIDStr>;

    clearSelected(reason: string): void;
    hasSelected(): boolean;

    lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock>;
    lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr>;
    pathToBlock(id: BlockIDStr): ReadonlyArray<Block>;

    setActive(active: BlockIDStr | undefined): void;

    setRoot(root: BlockIDStr | undefined): void;

    getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined;

    getBlockActivated(id: BlockIDStr): IBlockActivated | undefined;

    getBlock(id: BlockIDStr): Block | undefined;

    getBlockContentData(id: BlockIDStr): string | undefined;

    setActiveWithPosition(active: BlockIDStr | undefined,
                          activePos: NavPosition | undefined): void;

    expand(id: BlockIDStr): void;
    collapse(id: BlockIDStr): void;
    toggleExpand(id: BlockIDStr): void;
    setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void;

    isExpanded(id: BlockIDStr): boolean;
    isSelected(id: BlockIDStr): boolean;

    indentBlock(id: BlockIDStr): ReadonlyArray<DoIndentResult>;
    unIndentBlock(id: BlockIDStr): ReadonlyArray<DoUnIndentResult>;

    requiredAutoUnIndent(id: BlockIDStr): boolean;

    deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>): void;

    updateBlocks(blocks: ReadonlyArray<IBlock>): void;

    createNewBlock(id: BlockIDStr, opts?: INewBlockOpts): ICreatedBlock | undefined;

    createLinkToBlock<C extends IBlockContent = IBlockContent>(sourceID: BlockIDStr,
                                                               targetName: BlockNameStr,
                                                               undoContent: MarkdownStr,
                                                               content: MarkdownStr): void;

    filterByName(filter: string): ReadonlyArray<BlockNameStr>;

    clearDrop(): void;

    setDropSource(dropSource: BlockIDStr): void;
    setDropTarget(dropTarget: IDropTarget): void;

    mergeBlocks(target: BlockIDStr, source: BlockIDStr): void;

    canMerge(id: BlockIDStr): IBlockMerge | undefined;

    navPrev(pos: NavPosition, opts: NavOpts): void;
    navNext(pos: NavPosition, opts: NavOpts): void;

    getNamedNodes(): ReadonlyArray<string>;

    setBlockContent<C extends IBlockContent = IBlockContent>(id: BlockIDStr, content: C): void;

}
