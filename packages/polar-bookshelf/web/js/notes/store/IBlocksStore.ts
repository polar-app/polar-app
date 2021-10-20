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
    IDropTarget,
    INewBlockOpts,
    DoPutOpts,
    ICreateNewNamedBlockOpts,
    BlocksIndexByName,
    Interstitial,
    IDropPosition,
    BlocksIndexByDocumentID,
    IInsertBlocksContentStructureOpts,
    ICreateBlockContentStructureOpts,
} from "./BlocksStore";
import {Block} from "./Block";
import {ReverseIndex} from "./ReverseIndex";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {RelatedTagsManager} from "../../tags/related/RelatedTagsManager";
import {IAnnotationHighlightContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

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
    indexByDocumentID: BlocksIndexByDocumentID;
    selected: StringSetMap;
    relatedTagsManager: RelatedTagsManager;

    hasSnapshot: boolean;

    doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void;
    doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void;

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

    setActiveWithPosition(active: BlockIDStr | undefined,
                          activePos: NavPosition | undefined): void;

    getActiveBlockForNote(id: BlockIDStr): IActiveBlock | undefined;
    saveActiveBlockForNote(id: BlockIDStr): void;

    idsToBlocks(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<Block>;
    renameBlock(id: BlockIDStr, newName: MarkdownStr): void;

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

    createNewNamedBlock(opts: ICreateNewNamedBlockOpts): BlockIDStr;

    createLinkToBlock<C extends IBlockContent = IBlockContent>(sourceID: BlockIDStr,
                                                               targetName: BlockNameStr,
                                                               content: MarkdownStr): void;

    insertFromBlockContentStructure(blocks: ReadonlyArray<IBlockContentStructure>,
                                    opts?: IInsertBlocksContentStructureOpts): ReadonlyArray<BlockIDStr>;
    createBlockContentStructure(ids: ReadonlyArray<BlockIDStr>, opts?: ICreateBlockContentStructureOpts): ReadonlyArray<IBlockContentStructure>;

    filterByName(filter: string): ReadonlyArray<BlockNameStr>;

    clearDrop(): void;
    clearDropTarget(): void;

    setDropSource(dropSource: BlockIDStr): void;
    setDropTarget(dropTarget: IDropTarget): void;

    mergeBlocks(target: BlockIDStr, source: BlockIDStr): void;

    canMergePrev(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined;
    canMergeNext(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined;

    navPrev(root: BlockIDStr, opts: NavOpts): void;
    navNext(root: BlockIDStr, opts: NavOpts): void;

    getNamedBlocks(): ReadonlyArray<string>;

    setBlockContent<C extends IBlockContent = IBlockContent>(id: BlockIDStr, content: C): void;
    setHighlightAnnotationBlockContent(id: BlockIDStr, content: IAnnotationHighlightContent, docMeta: IDocMeta): void;

    moveBlocks(ids: ReadonlyArray<BlockIDStr>, delta: number): void

    getInterstitials(id: BlockIDStr, position?: IDropPosition): ReadonlyArray<Interstitial>;
    addInterstitial(id: BlockIDStr, interstitial: Interstitial): void;
    removeInterstitial(id: BlockIDStr, interstitialID: string): void;

    prevSibling(id: BlockIDStr): BlockIDStr | undefined;
    nextSibling(id: BlockIDStr): BlockIDStr | undefined;

    styleSelectedBlocks(style: DOMBlocks.MarkdownStyle): void;

    cursorOffsetCapture(): IActiveBlock | undefined;
    cursorOffsetRestore(active: IActiveBlock | undefined): void;

    createSnapshot(identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock>;
}
