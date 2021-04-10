import {IBlocksStore} from "./IBlocksStore";
import {
    BlockIDStr, BlockNameStr,
    BlocksIndex, DoIndentResult, DoPutOpts, DoUnIndentResult,
    IActiveBlock, IBlockActivated,
    IBlockMerge,
    ICreatedBlock,
    ISplitBlock, NavOpts, NavPosition,
    StringSetMap
} from "./BlocksStore";
import {ReverseIndex} from "./ReverseIndex";
import {IBlock} from "./IBlock";
import {Block} from "./Block";
import {BlockTargetStr} from "../NoteLinkLoader";

export class TracingBlocksStore implements IBlocksStore {

    constructor(private readonly delegate: IBlocksStore) {
    }

    public get active(): IActiveBlock | undefined {
        return this.delegate.active;
    }

    public get dropSource(): string | undefined {
        return this.delegate.dropSource;
    }

    public get dropTarget(): string | undefined {
        return this.delegate.dropTarget;
    }

    public get index(): BlocksIndex {
        return this.delegate.index;
    }

    public get reverse(): ReverseIndex {
        return this.delegate.reverse;
    }

    public get root(): BlockIDStr | undefined {
        return this.delegate.root;
    }

    public get selected(): StringSetMap {
        return this.delegate.selected;
    }

    canMerge(id: BlockIDStr): IBlockMerge | undefined {
        return this.delegate.canMerge(id);
    }

    clearDrop(): void {
        this.delegate.clearDrop();
    }

    clearSelected(reason: string): void {
        this.delegate.clearSelected(reason);
    }

    collapse(id: BlockIDStr): void {
        this.delegate.collapse(id);
    }

    createNewBlock(id: BlockIDStr, split?: ISplitBlock): ICreatedBlock {
        return this.delegate.createNewBlock(id, split);
    }

    createNewNamedBlock(name: BlockNameStr, ref: BlockIDStr): BlockIDStr {
        return this.delegate.createNewNamedBlock(name, ref);
    }

    doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void {
        return this.delegate.doDelete(blockIDs);
    }

    doIndent(id: BlockIDStr): ReadonlyArray<DoIndentResult> {
        return this.delegate.doIndent(id);
    }

    doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void {
        this.delegate.doPut(blocks);
    }

    doUnIndent(id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {
        return this.delegate.doUnIndent(id)
    }

    expand(id: BlockIDStr): void {
        this.delegate.expand(id);
    }

    filterByName(filter: string): ReadonlyArray<BlockNameStr> {
        return this.delegate.filterByName(filter);
    }

    getBlock(id: BlockIDStr): Block | undefined {
        return this.delegate.getBlock(id);
    }

    getBlockActivated(id: BlockIDStr): IBlockActivated | undefined {
        return this.delegate.getBlockActivated(id);
    }

    getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined {
        return this.delegate.getBlockByTarget(target);
    }

    getNamedNodes(): ReadonlyArray<string> {
        return this.delegate.getNamedNodes();
    }

    hasSelected(): boolean {
        return this.delegate.hasSelected();
    }

    isExpanded(id: BlockIDStr): boolean {
        return this.delegate.isExpanded(id);
    }

    isSelected(id: BlockIDStr): boolean {
        return false;
    }

    lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        return this.delegate.lookup(blocks);
    }

    lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this.delegate.lookupReverse(id);
    }

    mergeBlocks(target: BlockIDStr, source: BlockIDStr): void {
        this.delegate.mergeBlocks(target, source);
    }

    navNext(pos: NavPosition, opts: NavOpts): void {
        this.delegate.navNext(pos, opts);
    }

    navPrev(pos: NavPosition, opts: NavOpts): void {
        this.delegate.navNext(pos, opts);
    }

    pathToBlock(id: BlockIDStr): ReadonlyArray<Block> {
        return this.delegate.pathToBlock(id);
    }

    requiredAutoUnIndent(id: BlockIDStr): boolean {
        return this.delegate.requiredAutoUnIndent(id);
    }

    setActive(active: BlockIDStr | undefined): void {
        this.delegate.setActive(active);
    }

    setActiveWithPosition(active: BlockIDStr | undefined, activePos: NavPosition | undefined): void {
        this.delegate.setActiveWithPosition(active, activePos);
    }

    setDropSource(dropSource: BlockIDStr): void {
        this.delegate.setDropSource(dropSource);
    }

    setDropTarget(dropTarget: BlockIDStr): void {
        this.delegate.setDropTarget(dropTarget);
    }

    setRoot(root: BlockIDStr | undefined): void {
        this.delegate.setRoot(root);
    }

    setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void {
        this.delegate.setSelectionRange(fromBlock, toBlock);
    }

    toggleExpand(id: BlockIDStr): void {
        this.delegate.toggleExpand(id);
    }

}
