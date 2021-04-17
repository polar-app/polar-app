import {IBlocksStore} from "../store/IBlocksStore";
import {
    BlockIDStr, BlockNameStr,
    BlocksIndex, DoIndentResult, DoPutOpts, DoUnIndentResult,
    IActiveBlock, IBlockActivated,
    IBlockMerge,
    ICreatedBlock, IDropTarget, INewBlockOpts,
    ISplitBlock, NavOpts, NavPosition,
    StringSetMap
} from "../store/BlocksStore";
import {ReverseIndex} from "../store/ReverseIndex";
import {IBlock} from "../store/IBlock";
import {Block} from "../store/Block";
import {BlockTargetStr} from "../NoteLinkLoader";

/**
 * Creates an undo/redo store that we can use to undo/revert operations in the store.
 */
export class UndoBlocksStore implements IBlocksStore {

    constructor(private readonly delegate: IBlocksStore) {
    }

    public get active(): IActiveBlock | undefined {
        return this.delegate.active;
    }

    public get dropSource(): string | undefined {
        return this.delegate.dropSource;
    }

    public get dropTarget(): IDropTarget | undefined {
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

    public canMerge(id: BlockIDStr): IBlockMerge | undefined {
        return this.delegate.canMerge(id);
    }

    public clearDrop(): void {
        this.delegate.clearDrop();
    }

    public clearSelected(reason: string): void {
        this.delegate.clearSelected(reason);
    }

    public collapse(id: BlockIDStr): void {
        this.delegate.collapse(id);
    }

    public createNewBlock(id: BlockIDStr, opts?: INewBlockOpts): ICreatedBlock {
        return this.delegate.createNewBlock(id, opts);
    }

    public createNewNamedBlock(name: BlockNameStr, ref: BlockIDStr): BlockIDStr {
        return this.delegate.createNewNamedBlock(name, ref);
    }

    public doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void {
        return this.delegate.doDelete(blockIDs);
    }

    public doIndent(id: BlockIDStr): ReadonlyArray<DoIndentResult> {
        return this.delegate.doIndent(id);
    }

    public doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void {
        this.delegate.doPut(blocks);
    }

    public doUnIndent(id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {
        return this.delegate.doUnIndent(id)
    }

    public expand(id: BlockIDStr): void {
        this.delegate.expand(id);
    }

    public filterByName(filter: string): ReadonlyArray<BlockNameStr> {
        return this.delegate.filterByName(filter);
    }

    public getBlock(id: BlockIDStr): Block | undefined {
        return this.delegate.getBlock(id);
    }

    public getBlockContentData(id: BlockIDStr): string | undefined {
        return this.delegate.getBlockContentData(id);
    }

    public getBlockActivated(id: BlockIDStr): IBlockActivated | undefined {
        return this.delegate.getBlockActivated(id);
    }

    public getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined {
        return this.delegate.getBlockByTarget(target);
    }

    public getNamedNodes(): ReadonlyArray<string> {
        return this.delegate.getNamedNodes();
    }

    public hasSelected(): boolean {
        return this.delegate.hasSelected();
    }

    public isExpanded(id: BlockIDStr): boolean {
        return this.delegate.isExpanded(id);
    }

    public isSelected(id: BlockIDStr): boolean {
        return false;
    }

    public lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        return this.delegate.lookup(blocks);
    }

    public lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this.delegate.lookupReverse(id);
    }

    public mergeBlocks(target: BlockIDStr, source: BlockIDStr): void {
        this.delegate.mergeBlocks(target, source);
    }

    public navNext(pos: NavPosition, opts: NavOpts): void {
        this.delegate.navNext(pos, opts);
    }

    public navPrev(pos: NavPosition, opts: NavOpts): void {
        this.delegate.navPrev(pos, opts);
    }

    public pathToBlock(id: BlockIDStr): ReadonlyArray<Block> {
        return this.delegate.pathToBlock(id);
    }

    public requiredAutoUnIndent(id: BlockIDStr): boolean {
        return this.delegate.requiredAutoUnIndent(id);
    }

    public setActive(active: BlockIDStr | undefined): void {
        this.delegate.setActive(active);
    }

    public setActiveWithPosition(active: BlockIDStr | undefined, activePos: NavPosition | undefined): void {
        this.delegate.setActiveWithPosition(active, activePos);
    }

    public setDropSource(dropSource: BlockIDStr): void {
        this.delegate.setDropSource(dropSource);
    }

    public setDropTarget(dropTarget: IDropTarget): void {
        this.delegate.setDropTarget(dropTarget);
    }

    public setRoot(root: BlockIDStr | undefined): void {
        this.delegate.setRoot(root);
    }

    public setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void {
        this.delegate.setSelectionRange(fromBlock, toBlock);
    }

    public toggleExpand(id: BlockIDStr): void {
        this.delegate.toggleExpand(id);
    }

}
