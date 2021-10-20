import {MarkdownStr} from "polar-shared/src/util/Strings";
import {Block} from "./store/Block";
import {BlockNameStr,
    DoIndentResult,
    DoUnIndentResult,
    IActiveBlock,
    IBlockActivated,
    IBlockMerge,
    ICreateBlockContentStructureOpts,
    ICreatedBlock,
    ICreateNewNamedBlockOpts,
    IDropTarget,
    IInsertBlocksContentStructureOpts,
    INewBlockOpts,
    Interstitial,
    NavOpts,
    NavPosition
} from "./store/BlocksStore";
import {IBlocksStore} from "./store/IBlocksStore";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import {DOMBlocks} from "./contenteditable/DOMBlocks";
import {IBlockContentStructure} from "polar-blocks/src/blocks/IBlock";

export class BlocksTreeStore {
    public readonly root: BlockIDStr;
    private readonly blocksStore: IBlocksStore;
    private readonly rootAutoExpanded: boolean;

    constructor(root: BlockIDStr, blocksStore: IBlocksStore, autoExpandRoot: boolean) {
        this.root = root;
        this.blocksStore = blocksStore;
        this.rootAutoExpanded = autoExpandRoot;
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

    createNewNamedBlock(opts: ICreateNewNamedBlockOpts): BlockIDStr {
        return this.blocksStore.createNewNamedBlock(opts);
    }

    createLinkToBlock(sourceID: BlockIDStr, targetName: BlockNameStr, content: MarkdownStr): void {
        return this.blocksStore.createLinkToBlock(sourceID, targetName, content);
    };

    setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr): void {
        return this.blocksStore.setSelectionRange(this.root, fromBlock, toBlock);
    }

    renameBlock(id: BlockIDStr, newName: MarkdownStr): void {
        return this.blocksStore.renameBlock(id, newName);
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

    navPrev(opts: NavOpts): void {
        return this.blocksStore.navPrev(this.root, { ...opts, autoExpandRoot: this.rootAutoExpanded });
    }

    navNext(opts: NavOpts): void {
        return this.blocksStore.navNext(this.root, { ...opts, autoExpandRoot: this.rootAutoExpanded });
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
            return this.blocksStore.createNewBlock(id, {content: opts.content, unshift: true});
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

    insertFromBlockContentStructure(blocks: ReadonlyArray<IBlockContentStructure>,
                                    opts: IInsertBlocksContentStructureOpts = {}): ReadonlyArray<BlockIDStr> {
        return this.blocksStore.insertFromBlockContentStructure(blocks, opts);
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

    clearDropTarget(): void {
        return this.blocksStore.clearDropTarget();
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

    createBlockContentStructure(ids: ReadonlyArray<BlockIDStr>, opts?: ICreateBlockContentStructureOpts): ReadonlyArray<IBlockContentStructure> {
        return this.blocksStore.createBlockContentStructure(ids, opts);
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

    getInterstitials(id: BlockIDStr): ReadonlyArray<Interstitial> {
        return this.blocksStore.getInterstitials(id);
    }

    addInterstitial(id: BlockIDStr, interstitial: Interstitial): void {
        return this.blocksStore.addInterstitial(id, interstitial);
    }

    removeInterstitial(id: BlockIDStr, interstitialID: string): void {
        return this.blocksStore.removeInterstitial(id, interstitialID);
    }

    prevSibling(id: BlockIDStr) {
        return this.blocksStore.prevSibling(id);
    }

    nextSibling(id: BlockIDStr) {
        return this.blocksStore.nextSibling(id);
    }

    styleSelectedBlocks(style: DOMBlocks.MarkdownStyle): void {
        return this.blocksStore.styleSelectedBlocks(style);
    }

    cursorOffsetCapture() {
        return this.blocksStore.cursorOffsetCapture();
    }

    cursorOffsetRestore(active: IActiveBlock | undefined) {
        return this.blocksStore.cursorOffsetRestore(active);
    }
}
