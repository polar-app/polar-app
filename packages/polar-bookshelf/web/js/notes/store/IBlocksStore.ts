import {
    IBlockActivated,
    NavOpts,
    NavPosition,
    StringSetMap,
    DoIndentResult,
    DoUnIndentResult,
    ICreatedBlock,
    IActiveBlock,
    BlockNameStr,
    IBlockMerge,
    BlocksIndex,
    IDropTarget, INewBlockOpts, DoPutOpts, ICreateNewNamedBlockOpts, BlocksIndexByName
} from "./BlocksStore";
import {Block} from "./Block";
import {ReverseIndex} from "./ReverseIndex";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "../HTMLToBlocks";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";

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

    active: IActiveBlock | undefined;
    dropSource: BlockIDStr | undefined;
    dropTarget: IDropTarget | undefined;
    reverse: ReverseIndex;
    index: BlocksIndex;
    indexByName: BlocksIndexByName;
    selected: StringSetMap;

    hasSnapshot: boolean;

    doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void;
    doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void;

    doCreateNewNamedBlock(name: BlockNameStr,
                          opts?: ICreateNewNamedBlockOpts): BlockIDStr;

    selectedIDs(): ReadonlyArray<BlockIDStr>;

    clearSelected(reason: string): void;
    hasSelected(): boolean;

    lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock>;
    lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr>;
    pathToBlock(id: BlockIDStr): ReadonlyArray<Block>;

    setActive(active: BlockIDStr | undefined): void;

    getBlockByName(name: BlockNameStr): Block | undefined;
    getBlockByTarget(target: BlockIDStr | BlockNameStr): Block | undefined;

    getBlockActivated(id: BlockIDStr): IBlockActivated | undefined;

    getBlockForMutation(id: BlockIDStr): Block | undefined;
    getBlock(id: BlockIDStr): Readonly<Block> | undefined;

    getBlockContentData(id: BlockIDStr): string | undefined;

    setActiveWithPosition(active: BlockIDStr | undefined,
                          activePos: NavPosition | undefined): void;

    getActiveBlockForNote(id: BlockIDStr): IActiveBlock | undefined;
    saveActiveBlockForNote(id: BlockIDStr): void;

    idsToBlocks(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<Block>;

    // TODO: undo
    expand(id: BlockIDStr): void;
    // TODO: undo
    collapse(id: BlockIDStr): void;

    toggleExpand(id: BlockIDStr): void;

    setSelectionRange(root: BlockIDStr, fromBlock: BlockIDStr, toBlock: BlockIDStr): void;

    isExpanded(id: BlockIDStr): boolean;
    isSelected(id: BlockIDStr): boolean;

    // TODO: undo / cursor
    indentBlock(root: BlockIDStr, id: BlockIDStr): ReadonlyArray<DoIndentResult>;
    // TODO: undo / cursor
    unIndentBlock(root: BlockIDStr, id: BlockIDStr): ReadonlyArray<DoUnIndentResult>;

    requiredAutoUnIndent(root: BlockIDStr, id: BlockIDStr): boolean;

    // TODO: undo / cursor
    deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>): void;

    updateBlocks(blocks: ReadonlyArray<IBlock>): void;

    // TODO: undo / cursor
    createNewBlock(id: BlockIDStr, opts?: INewBlockOpts): ICreatedBlock;
    doCreateNewBlock(id: BlockIDStr, opts?: INewBlockOpts): ICreatedBlock;

    createNewNamedBlock(name: BlockNameStr, opts: ICreateNewNamedBlockOpts): BlockIDStr;

    createLinkToBlock<C extends IBlockContent = IBlockContent>(sourceID: BlockIDStr,
                                                               targetName: BlockNameStr,
                                                               content: MarkdownStr): void;

    insertFromBlockContentStructure(blocks: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<BlockIDStr>;
    createBlockContentStructure(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlockContentStructure>;

    filterByName(filter: string): ReadonlyArray<BlockNameStr>;

    clearDrop(): void;

    setDropSource(dropSource: BlockIDStr): void;
    setDropTarget(dropTarget: IDropTarget): void;

    mergeBlocks(target: BlockIDStr, source: BlockIDStr): void;

    canMergePrev(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined;
    canMergeNext(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined;

    navPrev(root: BlockIDStr, pos: NavPosition, opts: NavOpts): void;
    navNext(root: BlockIDStr, pos: NavPosition, opts: NavOpts): void;

    getNamedBlocks(): ReadonlyArray<string>;

    setBlockContent<C extends IBlockContent = IBlockContent>(id: BlockIDStr, content: C): void;

    moveBlocks(ids: ReadonlyArray<BlockIDStr>, delta: number): void
}
