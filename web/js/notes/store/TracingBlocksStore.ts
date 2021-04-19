import {IBlocksStore} from "./IBlocksStore";
import {
    BlockIDStr, BlockNameStr,
    BlocksIndex, DoIndentResult, DoPutOpts, DoUnIndentResult,
    IActiveBlock, IBlockActivated,
    IBlockMerge,
    ICreatedBlock, IDropTarget, INewBlockOpts,
    ISplitBlock, NavOpts, NavPosition,
    StringSetMap
} from "./BlocksStore";
import {ReverseIndex} from "./ReverseIndex";
import {IBlock} from "./IBlock";
import {Block} from "./Block";
import {BlockTargetStr} from "../NoteLinkLoader";

const TRACE_ENABLED = true;

function trace(method: string, args: any = {}) {
    if (TRACE_ENABLED) {
        console.log(method, JSON.stringify(args, null, "  "));
    }
}

export class TracingBlocksStore implements IBlocksStore {

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

    public selected(): StringSetMap {
        return this.delegate.selected();
    }

    public canMerge(id: BlockIDStr): IBlockMerge | undefined {
        trace('canMerge', {id});
        return this.delegate.canMerge(id);
    }

    public clearDrop(): void {
        trace('clearDrop');
        this.delegate.clearDrop();
    }

    public clearSelected(reason: string): void {
        trace('clearSelected', {reason});
        this.delegate.clearSelected(reason);
    }

    public collapse(id: BlockIDStr): void {
        trace('collapse', {id});
        this.delegate.collapse(id);
    }

    public deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>): void {
        trace('deleteBlocks', {blockIDs});
        return this.delegate.deleteBlocks(blockIDs);
    }

    public createNewBlock(id: BlockIDStr, opts?: INewBlockOpts): ICreatedBlock | undefined {
        trace('createNewBlock', {id, opts});
        return this.delegate.createNewBlock(id, opts);
    }

    public createNewNamedBlock(name: BlockNameStr, ref: BlockIDStr): BlockIDStr {
        trace('createNewNamedBlock', {name, ref});
        return this.delegate.createNewNamedBlock(name, ref);
    }

    public doDelete(blockIDs: ReadonlyArray<BlockIDStr>): void {
        trace('doDelete', {blockIDs});
        return this.delegate.doDelete(blockIDs);
    }

    public indentBlock(id: BlockIDStr): ReadonlyArray<DoIndentResult> {
        trace('doIndent', {id});
        return this.delegate.indentBlock(id);
    }

    public doPut(blocks: ReadonlyArray<IBlock>, opts?: DoPutOpts): void {
        trace('doPut', {blocks, opts});
        this.delegate.doPut(blocks);
    }

    public unIndentBlock(id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {
        trace('doUnIndent', {id});
        return this.delegate.unIndentBlock(id)
    }

    public expand(id: BlockIDStr): void {
        trace('expand', {id});
        this.delegate.expand(id);
    }

    public filterByName(filter: string): ReadonlyArray<BlockNameStr> {
        trace('filterByName', {filter});
        return this.delegate.filterByName(filter);
    }

    public getBlock(id: BlockIDStr): Block | undefined {
        trace('getBlock', {id});
        return this.delegate.getBlock(id);
    }

    public getBlockContentData(id: BlockIDStr): string | undefined {
        trace('getBlockContentData', {id});
        return this.delegate.getBlockContentData(id);
    }

    public getBlockActivated(id: BlockIDStr): IBlockActivated | undefined {
        trace('getBlockActivated', {id});
        return this.delegate.getBlockActivated(id);
    }

    public getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined {
        trace('getBlockByTarget', {target});
        return this.delegate.getBlockByTarget(target);
    }

    public getNamedNodes(): ReadonlyArray<string> {
        trace('getNamedNodes', {});
        return this.delegate.getNamedNodes();
    }

    public hasSelected(): boolean {
        trace('hasSelected', {});
        return this.delegate.hasSelected();
    }

    public isExpanded(id: BlockIDStr): boolean {
        trace('isExpanded', {id});
        return this.delegate.isExpanded(id);
    }

    public isSelected(id: BlockIDStr): boolean {
        trace('isSelected', {id});
        return false;
    }

    public lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        trace('lookup', {blocks});
        return this.delegate.lookup(blocks);
    }

    public lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        trace('lookupReverse', {id});
        return this.delegate.lookupReverse(id);
    }

    public mergeBlocks(target: BlockIDStr, source: BlockIDStr): void {
        trace('mergeBlocks', {target, source});
        this.delegate.mergeBlocks(target, source);
    }

    public navNext(pos: NavPosition, opts: NavOpts): void {
        trace('navNext', {pos, opts});
        this.delegate.navNext(pos, opts);
    }

    public navPrev(pos: NavPosition, opts: NavOpts): void {
        trace('navPrev', {pos, opts});
        this.delegate.navPrev(pos, opts);
    }

    public pathToBlock(id: BlockIDStr): ReadonlyArray<Block> {
        trace('pathToBlock', {id});
        return this.delegate.pathToBlock(id);
    }

    public requiredAutoUnIndent(id: BlockIDStr): boolean {
        trace('requiredAutoUnIndent', {id});
        return this.delegate.requiredAutoUnIndent(id);
    }

    public setActive(active: BlockIDStr | undefined): void {
        trace('setActive', {active});
        this.delegate.setActive(active);
    }

    public setActiveWithPosition(active: BlockIDStr | undefined, activePos: NavPosition | undefined): void {
        trace('setActiveWithPosition', {active, activePos});
        this.delegate.setActiveWithPosition(active, activePos);
    }

    public setDropSource(dropSource: BlockIDStr): void {
        trace('setDropSource', {dropSource});
        this.delegate.setDropSource(dropSource);
    }

    public setDropTarget(dropTarget: IDropTarget): void {
        trace('setDropTarget', {dropTarget});
        this.delegate.setDropTarget(dropTarget);
    }

    public setRoot(root: BlockIDStr | undefined): void {
        trace('setRoot', {root});
        this.delegate.setRoot(root);
    }

    public setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void {
        trace('setSelectionRange', {fromBlock, toBlock});
        this.delegate.setSelectionRange(fromBlock, toBlock);
    }

    public toggleExpand(id: BlockIDStr): void {
        trace('toggleExpand', {id});
        this.delegate.toggleExpand(id);
    }

    public redo(): Promise<void> {
        return Promise.resolve(undefined);
    }

    public undo(): Promise<void> {
        return Promise.resolve(undefined);
    }

}
