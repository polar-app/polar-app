import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockContentStructure} from "./HTMLToBlocks";
import {Block} from "./store/Block";
import {BlockIDStr, BlockNameStr, DoIndentResult, DoUnIndentResult, IActiveBlock, IBlockActivated, IBlockContent, IBlockMerge, ICreatedBlock, ICreateNewNamedBlockOpts, IDropTarget, INewBlockOpts, NavOpts, NavPosition} from "./store/BlocksStore";
import {IBlock} from "./store/IBlock";
import {IBlocksStore} from "./store/IBlocksStore";

export class BlocksTreeStore {
    public readonly root: BlockIDStr;
    private readonly blocksStore: IBlocksStore;

    constructor(root: BlockIDStr, blocksStore: IBlocksStore) {
        this.root = root;
        this.blocksStore = blocksStore;
    }

    get selected() {
        return this.blocksStore.selected;
    }

    get active() {
        return this.blocksStore.active;
    }

    get hasSnapshot() {
        return this.blocksStore.hasSnapshot;
    }

    get dropTarget() {
        return this.blocksStore.dropTarget;
    }

    get dropSource() {
        return this.blocksStore.dropSource;
    }

    createNewNamedBlock(name: BlockNameStr, opts: ICreateNewNamedBlockOpts): BlockIDStr {
        return this.blocksStore.createNewNamedBlock(name, opts);
    }

    createLinkToBlock(sourceID: BlockIDStr, targetName: BlockNameStr, content: MarkdownStr): void {
        return this.blocksStore.createLinkToBlock(sourceID, targetName, content);
    };

    setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void {
        return this.blocksStore.setSelectionRange(this.root, fromBlock, toBlock);
    }

    setActive(active: BlockIDStr | undefined): void {
        return this.blocksStore.setActive(active);
    }

    saveActiveBlockForNote(id: BlockIDStr): void {
        return this.blocksStore.saveActiveBlockForNote(id);
    }

    setActiveWithPosition(active: BlockIDStr | undefined, activePos: NavPosition | undefined): void {
        return this.blocksStore.setActiveWithPosition(active, activePos);
    }

    canMergePrev(id: BlockIDStr): IBlockMerge | undefined {
        return this.blocksStore.canMergePrev(this.root, id);
    }

    canMergeNext(id: BlockIDStr): IBlockMerge | undefined {
        return this.blocksStore.canMergeNext(this.root, id);
    }

    navPrev(pos: NavPosition, opts: NavOpts): void {
        return this.blocksStore.navPrev(this.root, pos, opts);
    }

    navNext(pos: NavPosition, opts: NavOpts): void {
        return this.blocksStore.navNext(this.root, pos, opts);
    }

    indentBlock(id: BlockIDStr): ReadonlyArray<DoIndentResult> {
        return this.blocksStore.indentBlock(this.root, id);
    }

    unIndentBlock(id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {
        return this.blocksStore.unIndentBlock(this.root, id);
    }

    requiredAutoUnIndent(id: BlockIDStr): boolean {
        return this.blocksStore.requiredAutoUnIndent(this.root, id);
    }

    createNewBlock(id: BlockIDStr, opts: INewBlockOpts = {}): ICreatedBlock | undefined {
        if (this.root === id) {
            return this.blocksStore.createNewBlock(id, {asChild: true});
        }
        return this.blocksStore.createNewBlock(id, opts);
    }

    collapse(id: BlockIDStr): void {
        return this.blocksStore.collapse(id);
    }

    expand(id: BlockIDStr): void {
        return this.blocksStore.expand(id);
    }

    moveBlocks(ids: ReadonlyArray<BlockIDStr>, delta: number): void {
        return this.blocksStore.moveBlocks(ids, delta);
    }

    hasSelected(): boolean {
        return this.blocksStore.hasSelected();
    }

    selectedIDs(): ReadonlyArray<BlockIDStr> {
        return this.blocksStore.selectedIDs();
    }

    getBlock(id: BlockIDStr): Readonly<Block> | undefined {
        return this.blocksStore.getBlock(id);
    }

    clearSelected(reason: string): void {
        return this.blocksStore.clearSelected(reason);
    }

    deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>): void {
        return this.blocksStore.deleteBlocks(blockIDs);
    }

    mergeBlocks(target: BlockIDStr, source: BlockIDStr): void {
        return this.blocksStore.mergeBlocks(target, source);
    }

    setBlockContent<C extends IBlockContent = IBlockContent>(id: BlockIDStr, content: C): void {
        return this.blocksStore.setBlockContent(id, content);
    }

    getBlockContentData(id: BlockIDStr): string | undefined {
        return this.blocksStore.getBlockContentData(id);
    }

    insertFromBlockContentStructure(blocks: ReadonlyArray<IBlockContentStructure>): ReadonlyArray<BlockIDStr> {
        return this.blocksStore.insertFromBlockContentStructure(blocks);
    }

    getNamedBlocks(): ReadonlyArray<string> {
        return this.blocksStore.getNamedBlocks();
    }

    getBlockByName(name: BlockNameStr): Block | undefined {
        return this.blocksStore.getBlockByName(name);
    }

    isExpanded(id: BlockIDStr): boolean {
        return this.blocksStore.isExpanded(id);
    }

    toggleExpand(id: BlockIDStr): void {
        return this.blocksStore.toggleExpand(id);
    }

    setDropSource(dropSource: BlockIDStr): void {
        return this.blocksStore.setDropSource(dropSource);
    }

    setDropTarget(dropTarget: IDropTarget): void {
        return this.blocksStore.setDropTarget(dropTarget);
    }

    lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        return this.blocksStore.lookup(blocks);
    }

    clearDrop(): void {
        return this.blocksStore.clearDrop();
    }

    isSelected(id: BlockIDStr): boolean {
        return this.blocksStore.isSelected(id);
    }

    pathToBlock(id: BlockIDStr): ReadonlyArray<Block> {
        return this.blocksStore.pathToBlock(id);
    }

    lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this.blocksStore.lookupReverse(id);
    }

    idsToBlocks(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<Block> {
        return this.blocksStore.idsToBlocks(ids);
    }

    createBlockContentStructure(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlockContentStructure> {
        return this.blocksStore.createBlockContentStructure(ids);
    }
    
    getActiveBlockForNote(id: BlockIDStr): IActiveBlock | undefined {
        return this.blocksStore.getActiveBlockForNote(id);
    }

    getBlockByTarget(target: BlockIDStr | BlockNameStr): Block | undefined {
        return this.blocksStore.getBlockByTarget(target);
    }

    getBlockActivated(id: BlockIDStr): IBlockActivated | undefined {
        return this.blocksStore.getBlockActivated(id);
    }

    filterByName(filter: string): ReadonlyArray<BlockNameStr> {
        return this.blocksStore.filterByName(filter);
    }
}
