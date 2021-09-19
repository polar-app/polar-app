import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {action, computed, makeObservable, observable} from "mobx"
import {IDStr, MarkdownStr} from "polar-shared/src/util/Strings";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockTargetStr} from "../NoteLinkLoader";
import {isPresent} from "polar-shared/src/Preconditions";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {ReverseIndex} from "./ReverseIndex";
import {Block} from "./Block";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Numbers} from "polar-shared/src/util/Numbers";
import {CursorPositions} from "../contenteditable/CursorPositions";
import {useBlocksStoreContext} from "./BlockStoreContextProvider";
import {IBlocksStore} from "./IBlocksStore";
import {BlockPredicates, TextContent} from "./BlockPredicates";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import {ImageContent} from "../content/ImageContent";
import {Contents} from "../content/Contents";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {useUndoQueue} from "../../undo/UndoQueueProvider2";
import {BlocksStoreUndoQueues} from "./BlocksStoreUndoQueues";
import {DateContent} from "../content/DateContent";
import {IBlockCollectionSnapshot, useBlockCollectionSnapshots} from "../persistence/BlockCollectionSnapshots";
import {BlocksPersistenceWriter} from "../persistence/FirestoreBlocksStoreMutations";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useBlocksPersistenceWriter} from "../persistence/BlocksPersistenceWriters";
import {WikiLinksToMarkdown} from "../WikiLinksToMarkdown";
import {IBlockExpandCollectionSnapshot, useBlockExpandCollectionSnapshots} from "../persistence/BlockExpandCollectionSnapshots";
import {BlockExpandPersistenceWriter, useBlockExpandPersistenceWriter} from "../persistence/BlockExpandWriters";
import {IBlockContentStructure} from "../HTMLToBlocks";
import {DOMBlocks} from "../contenteditable/DOMBlocks";
import {BlockIDStr, IBlock, IBlockContent, IBlockLink, NamespaceIDStr, UIDStr} from "polar-blocks/src/blocks/IBlock";
import {IBaseBlockContent} from "polar-blocks/src/blocks/content/IBaseBlockContent";
import {WriteController, WriteFileProgress} from "../../datastore/Datastore";
import {ProgressTrackerManager} from "../../datastore/FirebaseCloudStorage";
import {BlockContentCanonicalizer} from "../contenteditable/BlockContentCanonicalizer";
import {ContentEditableWhitespace} from "../ContentEditableWhitespace";
import {MarkdownContentConverter} from "../MarkdownContentConverter";
import {DeviceIDManager} from "polar-shared/src/util/DeviceIDManager";
import {DocumentContent} from "../content/DocumentContent";
import {AnnotationContent, AnnotationContentTypeMap} from "../content/AnnotationContent";
import {BlockTextContentUtils} from "../NoteUtils";

export const ENABLE_UNDO_TRACING = false;

export type BlockNameStr = string;

export type ActiveBlocksIndex = {[id: string /* BlockIDStr */]: IActiveBlock };
export type BlocksIndex = {[id: string /* BlockIDStr */]: Block};
export type BlocksIndexByName = {[name: string /* BlockNameStr */]: BlockIDStr};
export type BlocksIndexByDocumentID = {[docID: string /* IDStr */]: BlockIDStr};

export type ReverseBlocksIndex = {[id: string /* BlockIDStr */]: BlockIDStr[]};

export type StringSetMap = {[key: string]: boolean};

export type BlockContent = (MarkdownContent
                            | NameContent
                            | ImageContent
                            | DateContent
                            | DocumentContent
                            | AnnotationContent) & IBaseBlockContent;

export interface BlockContentMap extends AnnotationContentTypeMap {
    'markdown': MarkdownContent,
    'name': NameContent,
    'image': ImageContent,
    'date': DateContent,
    'document': DocumentContent,
};

export type BlockType = BlockContent['type'];

export type NamedContent = NameContent | DateContent | DocumentContent;

/**
 * A offset into the content of a not where we should place the cursor.
 */
export type BlockContentOffset = number;

/**
 * The position to place the cursor when jumping between items.
 *
 * When 'start' jump to the start.
 *
 * When 'end' jump to the end of the block.
 *
 * When undefined, make no jump.
 */
export type NavPosition = 'start' | 'end' | BlockContentOffset;

export interface IBlockActivated {
    readonly block: IBlock;
    readonly activePos: NavPosition | undefined;
}

export interface DoPutOpts {

    /**
     * The new active node after the put operation.
     */
    readonly newActive?: IActiveBlock;

    /**
     * Expand the give parent block.
     */
    readonly newExpand?: BlockIDStr;

    /**
     * Force update
     */
    readonly forceUpdate?: boolean;
}

export type NewBlockPosition = 'before' | 'after' | 'split';

export type NewChildPos = 'before' | 'after';

export interface INewChildPosition {
    readonly ref: BlockIDStr;
    readonly pos: NewChildPos;
}

export interface ISplitBlock {
    readonly prefix: string;
    readonly suffix: string;
}

export interface INewBlockOpts {
    readonly split?: ISplitBlock;
    readonly content?: IBlockContent;
    readonly asChild?: boolean;
    readonly newBlockID?: BlockIDStr;
}

export interface DeleteBlockRequest {
    readonly parent: BlockIDStr;
    readonly id: BlockIDStr;
}

export interface IMutation<E, V> {
    readonly error?: E;
    readonly value?: V;
}

export interface IBlockMerge {
    readonly source: BlockIDStr;
    readonly target: BlockIDStr;
}

export interface NavOpts {
    readonly shiftKey: boolean;

    readonly pos?: NavPosition;

    /*
     * This is used to determine whether roots should be treated as expanded, which is usually the case
     * Except for when dealing with the references of a note which can be collapsed.
     */
    readonly autoExpandRoot?: boolean;
}

export interface IInsertBlocksContentStructureOpts {
    blockIDs?: ReadonlyArray<BlockIDStr>;
}

export type InterstitialTypes = 'image';

export type Interstitial = {
    position: IDropPosition;
    blobURL: string;
    type: InterstitialTypes;
    id: string;
    controller: WriteController;
    progressTracker: ProgressTrackerManager<WriteFileProgress>;
};

export type InterstitialMap = { [key: string]: Interstitial[] | undefined };

/**
 * The result of a createBlock operation.
 */
export interface ICreatedBlock {
    /**
     * The ID of the newly created block.
     */
    readonly id: BlockIDStr;

    /**
     * The parent of the newly created block.
     */
    readonly parent: BlockIDStr;
}

export type DoIndentResult = IMutation<'no-block' | 'no-parent' | 'annotation-block' | 'no-parent-block' | 'no-sibling', BlockIDStr>;

export type DoUnIndentResult = IMutation<'no-block' | 'no-parent' | 'grandparent-is-document' | 'no-parent-block' | 'no-parent-block-parent' | 'no-parent-block-parent-block', BlockIDStr>

/**
 * The active block and the position it should be set to once it's made active.
 */
export interface IActiveBlock {

    readonly id: BlockIDStr;

    /**
     * The position within the block.  When undefined, do not jump the position
     * and keep the cursor where it is.
     */
    readonly pos: NavPosition | undefined;

    /**
     * A nonce that's unique to this block setting so that we don't attempt to
     * double jump the cursor.
     */
    readonly nonce: number;

}

export type IDropPosition = 'top' | 'bottom';

export interface IDropTarget {
    readonly id: BlockIDStr;
    readonly pos: IDropPosition;
}

export namespace ActiveBlockNonces {

    let value = 0;

    export function create() {
        return value++;
    }

}

export interface IDoDeleteOpts {

    /**
     * Do not delete items recursively.
     */
    readonly noDeleteItems?: boolean;

}

interface ICreateNewNamedBlockBase {
    readonly content: NamedContent;
}

export interface ICreateNewNamedBlockOptsBasic extends ICreateNewNamedBlockBase {
    readonly newBlockID?: BlockIDStr;
    readonly nspace?: NamespaceIDStr;
    readonly ref?: BlockIDStr;
}

export interface ICreateNewNamedBlockOptsWithNSpace extends ICreateNewNamedBlockBase {
    readonly newBlockID?: BlockIDStr;
    readonly nspace: NamespaceIDStr;
    readonly ref?: undefined;
}

export interface ICreateNewNamedBlockOptsWithRef  extends ICreateNewNamedBlockBase{
    readonly newBlockID?: BlockIDStr;
    readonly nspace?: undefined;
    readonly ref: BlockIDStr;
}

export type ICreateNewNamedBlockOpts = ICreateNewNamedBlockOptsBasic | ICreateNewNamedBlockOptsWithNSpace | ICreateNewNamedBlockOptsWithRef;

export interface IComputeLinearTreeOpts {
    /*
     * Include the parent
     */
    includeInitial?: boolean;

    /*
     * Only include expanded blocks
     */
    expanded?: boolean;

    /*
     * A custom root block
     * This is useful when showing trees in the references section
     * Where we don't have the entire tree
     */
    root?: BlockIDStr;
};

export class BlocksStore implements IBlocksStore {

    private readonly uid: UIDStr;

    private readonly undoQueue;

    @observable _index: BlocksIndex = {};

    @observable _indexByName: BlocksIndexByName = {};

    @observable _indexByDocumentID: BlocksIndexByDocumentID = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable _reverse: ReverseIndex = new ReverseIndex();

    /**
     * The currently active block.
     */
    @observable _active: IActiveBlock | undefined = undefined;
    /**
     * The blocks that are expanded.
     */
    @observable _expanded: StringSetMap = {};

    /**
     * The nodes that are selected by the user so that they can be highlighted in the UI.
     */
    @observable _selected: StringSetMap = {};

    @observable _dropTarget: IDropTarget | undefined = undefined;

    @observable _dropSource: BlockIDStr | undefined = undefined;

    /**
     * Used so that when we change the selected blocks, that we know which is the
     * FIRST so that we can compute a from and to based on their position.
     */
    @observable _selectedAnchor: IDStr | undefined = undefined;

    /**
     * True when we've received our first snapshot.
     */
    @observable _hasSnapshot: boolean = false;

    @observable _interstitials: InterstitialMap = {};

    /*
     * Used to keep track of cursor positions in every note
     */
    private _activeBlocksIndex: ActiveBlocksIndex = {};

    constructor(uid: UIDStr, undoQueue: UndoQueues2.UndoQueue,
                readonly blocksPersistenceWriter: BlocksPersistenceWriter = NULL_FUNCTION,
                readonly blockExpandPersistenceWriter: BlockExpandPersistenceWriter = NULL_FUNCTION) {

        this.uid = uid;
        this.undoQueue = undoQueue;
        makeObservable(this);

    }

    @computed get index() {
        return this._index;
    }

    @computed get indexByName() {
        return this._indexByName;
    }

    @computed get indexByDocumentID() {
        return this._indexByDocumentID;
    }

    /**
     * Get all the nodes by name.
     */
    getNamedBlocks(): ReadonlyArray<string> {
        const blocks = this.idsToBlocks(Object.values(this._indexByName)) as ReadonlyArray<Block<NamedContent>>;
        return blocks.map(block => BlockTextContentUtils.getTextContentMarkdown(block.content));
    }

    @computed get reverse() {
        return this._reverse;
    }

    @computed get expanded() {
        return this._expanded;
    }

    @computed get active() {
        return this._active;
    }

    @computed get selected() {
        return this._selected;
    }

    @computed get interstitials() {
        return this._interstitials;
    }

    public selectedIDs() {
        return Object.keys(this._selected);
    }

    /**
     * Compute notes that are the selected roots that have no parent that is
     * also selected.
     *
     * TODO: Remove this, because selections do this by default now.
     */
    public computeSelectedRoots() {
        const selected = this.selectedIDs();

        return selected.map(current => this.getBlock(current))
                       .filter(current => current !== undefined)
                       .map(current => current!)
                       .filter(current => current.parent === undefined || ! selected.includes(current.parent))

    }

    getInterstitials(id: BlockIDStr): ReadonlyArray<Interstitial> {
        return this._interstitials[id] || [];
    }

    @action addInterstitial(id: BlockIDStr, interstitial: Interstitial): void {
        const current = this._interstitials[id];
        if (! current) {
            this._interstitials[id] = [interstitial];
        } else {
            this._interstitials[id] = [interstitial, ...current];
        }
    }

    @action removeInterstitial(id: BlockIDStr, interstitialID: string): void {
        const blockInterstitials = this._interstitials[id];
        if (blockInterstitials) {
            const newInterstitials = blockInterstitials.filter(({id}) => id !== interstitialID);
            this._interstitials[id] = newInterstitials
            if (newInterstitials.length === 0) {
                delete this._interstitials[id];
            }
        }
    }

    @action public clearSelected(reason: string) {
        this.selectedIDs().forEach(id => delete this._selected[id]);
        this._selectedAnchor = undefined;
    }

    @computed get dropTarget() {
        return this._dropTarget;
    }

    @action public setDropTarget(dropTarget: IDropTarget) {
        this._dropTarget = dropTarget;
    }

    @computed get dropSource() {
        return this._dropSource;
    }

    @action public setDropSource(dropSource: BlockIDStr) {
        this._dropSource = dropSource;
    }

    @action public clearDrop() {
        this._dropTarget = undefined;
        this._dropSource = undefined;
    }

    @action public clearDropTarget() {
        this._dropTarget = undefined;
    }

    @computed get hasSnapshot() {
        return this._hasSnapshot;
    }

    /**
     * Return true if the given block is active.
     */
    public isActive(id: BlockIDStr): boolean {
        return this._active?.id === id;
    }

    public lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        return this.idsToBlocks(blocks).map(block => block.toJSON());
    }

    public lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this._reverse.get(id);
    }

    @action public doPut(blocks: ReadonlyArray<IBlock>, opts: DoPutOpts = {}) {

        for (const blockData of blocks) {

            const existingBlock = this.getBlock(blockData.id);

            if (!opts.forceUpdate && existingBlock && existingBlock.mutation >= blockData.mutation) {
                // skip this update as it hasn't changed
                continue;
            }

            const block = new Block(blockData);
            this._index[blockData.id] = block;

            if (BlockPredicates.isNamedBlock(block)) {
                const name = BlockTextContentUtils.getTextContentMarkdown(block.content).toLowerCase();
                this._indexByName[name] = block.id;
            }

            if (block.content.type === "document") {
                this._indexByDocumentID[block.content.docInfo.fingerprint] = block.id;
            }

            if (BlockPredicates.canHaveLinks(block)) {

                if (existingBlock && BlockPredicates.canHaveLinks(existingBlock)) {
                    for (const link of existingBlock.content.links) {
                        this._reverse.remove(link.id, block.id);
                    }
                }

                for (const link of block.content.links) {
                    this._reverse.add(link.id, block.id);
                }

            }

        }

        this._active = opts.newActive ? opts.newActive : this._active;

        if (opts.newExpand) {
            this._expanded[opts.newExpand] = true;
        }

    }

    @action public insertFromBlockContentStructure(
        blocks: ReadonlyArray<IBlockContentStructure>,
        opts: IInsertBlocksContentStructureOpts = {},
    ): ReadonlyArray<BlockIDStr> {
        const refID = this.active?.id;

        if (! refID) {
            console.error('Don\'t know where to insert the new blocks');
            return [];
        }

        const countBlocks = (blocks: ReadonlyArray<IBlockContentStructure>): number => blocks.length + blocks.reduce((sum, {children}) => sum + countBlocks(children), 0);
        const count = countBlocks(blocks);
        const ids: ReadonlyArray<BlockIDStr> = opts.blockIDs || Array.from({ length: count }).map(() => Hashcodes.createRandomID());

        if (ids.length !== count) {
            throw new Error('Not enough custom ids provided');
        }

        let i = 0;
        const redo = () => {
            const storeBlocks = (blocks: ReadonlyArray<IBlockContentStructure>, ref: BlockIDStr, isParent: boolean = false) => {
                [...blocks]
                    .reverse()
                    .forEach(({ children, content }) => {
                        const newBlockID = ids[i++];
                        const newBlock = this.doCreateNewBlock(ref, { asChild: isParent, content, newBlockID });
                        if (newBlock) {
                            storeBlocks(children, newBlock.id, true);
                        }
                    });
            };
            storeBlocks(blocks, refID, false);
            return ids;
        };

        const identifiers = [...[...ids].reverse(), this._index[refID].parent || refID];
        return this.doUndoPush('insertFromBlockContentStructure', identifiers, redo);
    }

    public hasSelected(): boolean {
        return Object.keys(this._selected).length > 0;
    }

    public containsBlock(id: BlockIDStr): boolean {
        return this.getBlock(id) !== undefined;
    }

    public getBlockForMutation(id: BlockIDStr): Block | undefined {
        const block = this._index[id];
        if (block) {
            return new Block(block.toJSON());
        }
        return undefined;
    }

    public getBlock(id: BlockIDStr): Readonly<Block> | undefined {
        return this._index[id];
    }

    public getParent(id: BlockIDStr): Block | undefined {

        const block = this._index[id];

        if (block) {

            if (block.parent) {
                return this._index[block.parent] || undefined;
            }

        }

        return undefined;

    }

    private doSibling(id: BlockIDStr, type: 'prev' | 'next'): BlockIDStr | undefined {

        const parent = this.getParent(id);

        if (parent) {

            const idx = parent.itemsAsArray.indexOf(id);

            if (idx !== -1) {

                switch (type) {

                    case "prev":
                        return Arrays.prevSibling(parent.itemsAsArray, idx);
                    case "next":
                        return Arrays.nextSibling(parent.itemsAsArray, idx);

                }

            }

        }

        return undefined;

    }

    public prevSibling(id: BlockIDStr) {
        return this.doSibling(id, 'prev');
    }

    public nextSibling(id: BlockIDStr) {
        return this.doSibling(id, 'next');
    }

    public children(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        const block = this.getBlock(id);
        if (block) {
            return block.itemsAsArray;
        }
        return [];
    }

    public getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined {

        const blockByID = this._index[target];

        if (blockByID) {
            return blockByID;
        }

        return this.getBlockByName(target);

    }

    public getBlockByName(name: BlockNameStr): Block | undefined {

        const lowercaseName = name.toLowerCase();
        const blockRefByName = this._indexByName[lowercaseName];

        if (blockRefByName) {
            return this._index[blockRefByName] || undefined;
        }

        return undefined;

    }

    public getActiveBlock(id: BlockIDStr): Block | undefined {

        const active = this._active;

        if (! active) {
            return undefined;
        }

        return this._index[id] || undefined;
    }

    public filterByName(filter: string): ReadonlyArray<BlockNameStr> {

        filter = filter.toLowerCase();

        return Object.keys(this._indexByName)
            .filter(key => key.toLowerCase().indexOf(filter) !== -1);

    }

    @action private doExpand(id: BlockIDStr, expand: boolean) {

        if (expand) {
            this._expanded[id] = true;
        } else {
            delete this._expanded[id];
        }

    }

    @action public expand(id: BlockIDStr) {

        this.doExpand(id, true);

        this.blockExpandPersistenceWriter([
            {
                id,
                type: 'added'
            },
        ]);

    }

    @action public collapse(id: BlockIDStr) {

        this.doExpand(id, false);

        this.blockExpandPersistenceWriter([
            {
                id,
                type: 'removed'
            },
        ]);

    }

    public toggleExpand(id: BlockIDStr) {

        if (this._expanded[id]) {
            this.collapse(id);
        } else {
            this.expand(id);
        }

    }

    @action public setSelectionRange(root: BlockIDStr,
                                     fromBlockID: BlockIDStr,
                                     toBlockID: BlockIDStr) {
        if (! root) {
            throw new Error("No root");
        }

        const linearExpansionTree = this.computeLinearTree(root, {expanded: true, includeInitial: true, root});

        const fromBlockIdx = linearExpansionTree.indexOf(fromBlockID);
        const toBlockIdx = linearExpansionTree.indexOf(toBlockID);

        if (fromBlockIdx === -1) {
            throw new Error("selectedAnchor not found: " + fromBlockID);
        }

        if (toBlockIdx === -1) {
            throw new Error("toBlockIdx not found");
        }

        const min = Math.min(fromBlockIdx, toBlockIdx);
        const max = Math.max(fromBlockIdx, toBlockIdx);

        const newSelected = new Set(
            arrayStream(Numbers.range(min, max))
                .map(current => linearExpansionTree[current])
                .collect()
        );

        const isParentSelected = (id: BlockIDStr) =>
            this._index[id].parents.some(parent => newSelected.has(parent));

        // Remove redundant blocks
        newSelected.forEach((id) => {
            if (isParentSelected(id)) {
                newSelected.delete(id);
            }
        });


        this.selectedIDs().forEach(id => delete this._selected[id]);
        [...newSelected].forEach(id => this._selected[id] = true);
    }

    @action public doNav(root: BlockIDStr,
                         delta: 'prev' | 'next',
                         opts: NavOpts): boolean {

        const {shiftKey, autoExpandRoot} = opts;

        if (this._active === undefined) {
            console.warn("No currently active node");
            return false;
        }
        
        const DoDOMNav = () => {
            const newBlockID = DOMBlocks.nav(delta, opts.pos);
            if (newBlockID) {
                this.setActive(newBlockID);
            }
        };

        if (! shiftKey) {
            this.clearSelected('doNav');
            DoDOMNav();
            return true;
        }

        const items = this.computeLinearTree(root, {
            expanded: true,
            includeInitial: true,
            root: autoExpandRoot ? root : undefined,
        });

        const childIndex = items.indexOf(this._active?.id);

        if (childIndex === -1) {
            console.warn(`Child ${this._active.id} not in block items`);
            return false;
        }

        const deltaIndex = delta === 'prev' ? -1 : 1;

        const activeIndex = childIndex + deltaIndex;
        const newActive = items[activeIndex];

        // If we don't have any active blocks in the current tree and shift is held down and we already have a selection then just skip
        // This is sort of a special case because lets say the cursor is at the first/last block and we're trying to select it.
        // We want to allow selecting it but after that if try to navigate down for example and there's no more blocks then just skip.
        if (! newActive && shiftKey && this.hasSelected()) {
            return true;
        }

        if (shiftKey) {

            if (this.hasSelected()) {
                this.setSelectionRange(root, newActive, this._selectedAnchor!);
            } else {

                // only select the entire/current node at first.
                this._selected[this._active?.id] = true;
                this._selectedAnchor = this._active?.id;

                function clearSelection() {
                    const sel = window.getSelection()!;
                    sel.getRangeAt(0).collapse(true);
                }

                // TODO: this probably shouldn't be here - in the store.
                clearSelection();

                return true;
            }

        } else {
            // no shift key so by definition nothing is selected so clear the selections
            this.clearSelected('doNav');
        }

        DoDOMNav();        

        return true;

    }

    public navPrev(root: BlockIDStr, opts: NavOpts) {
        return this.doNav(root, 'prev', opts);
    }

    public navNext(root: BlockIDStr, opts: NavOpts) {
        return this.doNav(root, 'next', opts);
    }

    /**
     * A 'linear' expansion tree is are the list of expanded nodes as a series
     * as if you enumerated them from top to bottom.
     *
     * So for example:
     *
     * - A
     *     - B
     *     - C
     * - D
     *
     * The result would be [A, B, C, D]
     */
    public computeLinearTree(id: BlockIDStr, opts?: IComputeLinearTreeOpts): ReadonlyArray<BlockIDStr> {
        const { expanded = false, includeInitial = false, root } = opts || {};

        const computeTree = (block: Block, requireExpansion: boolean): ReadonlyArray<BlockIDStr> => {
            if (requireExpansion && ! this._expanded[block.id]) {
                return [];
            }

            return this.idsToBlocks(block.itemsAsArray)
                .reduce<BlockIDStr[]>((result, item) => {
                    result.push(item.id);
                    result.push(...computeTree(item, expanded));
                    return result;
                }, []);
        };

        const block = this._index[id];

        if (! block) {
            console.warn("computeLinearTree: No block: " + id);
            return [];
        }

        const result = computeTree(block, expanded && block.id !== root);

        return includeInitial ? [id, ...result] : result;
    }

    @action public setActive(active: BlockIDStr | undefined) {

        if (active) {
            this._active = {
                id: active,
                pos: undefined,
                nonce: ActiveBlockNonces.create()
            };
        } else {
            this._active = undefined;
        }

    }

    @action public setActiveWithPosition(active: BlockIDStr | undefined,
                                         activePos: NavPosition | undefined) {

        if (active) {
            this._active = {
                id: active,
                pos: activePos,
                nonce: ActiveBlockNonces.create()
            };
        } else {
            this._active = undefined;
        }

    }

    public getActiveBlockForNote(id: BlockIDStr): IActiveBlock | undefined {
        return this._activeBlocksIndex[id];
    }

    public saveActiveBlockForNote(id: BlockIDStr): void {
        const active = this.cursorOffsetCapture();
        if (active) {
            this._activeBlocksIndex[id] = active;
        } else {
            delete this._activeBlocksIndex[id];
        }
    }

    public isExpanded(id: BlockIDStr): boolean {
        return isPresent(this._expanded[id]);
    }

    public isSelected(id: BlockIDStr): boolean {
        return isPresent(this._selected[id]);
    }

    public getBlockActivated(id: BlockIDStr): IBlockActivated | undefined {

        const active = this._active;

        if (! active) {
            return undefined;
        }

        if (id !== active.id) {
            return undefined;
        }

        const block = this._index[active.id];

        if (block) {
            return {block, activePos: active.pos};
        } else {
            return undefined;
        }

    }

    /**
     * Return true if this block can be merged. Meaning it has a previous sibling
     * we can merge with or a parent.
     */
    public canMergePrev(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined {

        if (id === root) {
            return undefined;
        }

        const expansionTree = this.computeLinearTree(root, { expanded: true, root });
        const currentIdx = expansionTree.indexOf(id);
        const target = expansionTree[currentIdx - 1];

        if (currentIdx > -1 && target) {
            return {
                source: id,
                target: target,
            };
        }

        const block = this.getBlock(id);

        if (block?.parent) {

            const parentBlock = this.getBlock(block.parent);

            if (parentBlock) {

                if (
                    this.canMergeTypes(block, parentBlock) ||
                    this.canMergeWithDelete(block, parentBlock)
                ) {
                    return {
                        source: id,
                        target: block.parent
                    };
                }

            }

        }

        return undefined;

    }

    public canMergeNext(root: BlockIDStr, id: BlockIDStr): IBlockMerge | undefined {
        const children = this.children(id);

        if (children.length > 0) {
            const child = Arrays.first(children)!;
            const nestedChildren = this.children(child);
            if (nestedChildren.length === 0) {
                return {
                    source: child,
                    target: id
                };
            } else {
                return undefined;
            }
        }

        const getNextIndirectSibling = (id: BlockIDStr): string | undefined => {
            const next = this.nextSibling(id);
            if (next) {
                return next;
            } else {
                const parent = this.getParent(id);
                if (parent && parent.id !== root) {
                    return getNextIndirectSibling(parent.id);
                }
            }
            return undefined;
        };

        const sibling = getNextIndirectSibling(id);

        if (sibling) {
            return {
                source: sibling,
                target: id
            };
        }
        return undefined;
    }

    public canMergeTypes(sourceBlock: IBlock, targetBlock: IBlock): boolean {
        return targetBlock.content.type === sourceBlock.content.type;
    }

    public canMergeWithDelete(sourceBlock: IBlock, targetBlock: IBlock) {

        if (! this.canMergeTypes(sourceBlock, targetBlock)) {

            return this.blockIsEmpty(sourceBlock.id) &&
                   this.children(sourceBlock.id).length === 0;

        }

        return false;

    }

    @action public mergeBlocks(target: BlockIDStr, source: BlockIDStr) {

        const redo = () => {

            const targetBlock = this.getBlockForMutation(target);
            const sourceBlock = this.getBlockForMutation(source);

            if (!targetBlock || !sourceBlock) {
                return;
            }

            if (! this.canMergeTypes(sourceBlock, targetBlock)) {

                if (this.canMergeWithDelete(sourceBlock, targetBlock)) {
                    // this is an edge case where a merge to the parent isn't
                    // possible but the child is empty so we just delete the child.
                    this.doDelete([sourceBlock.id]);
                    this.setActiveWithPosition(targetBlock.id, 'end');
                    return 'block-merged-with-delete';
                }

                console.warn("Block types are incompatible and can't be merged");
                return 'incompatible-block-types';
            }

            if (sourceBlock.content.type !== 'markdown' || targetBlock.content.type !== 'markdown') {
                throw new Error("Attempt to merge invalid content types");
            }

            const offset = CursorPositions.renderedTextLength(targetBlock.content.data);

            const sourceItems = sourceBlock.itemsAsArray;
            const items = [...targetBlock.itemsAsArray, ...sourceBlock.itemsAsArray];
            const links = [...targetBlock.content.links, ...sourceBlock.content.links];

            const newContent = targetBlock.content.data + sourceBlock.content.data;
            const directChildrenBlocks = this.idsToBlocks(sourceItems);
            const nestedChildrenIDs = sourceItems.flatMap(item => this.computeLinearTree(item));

            const updateParent = (newParent: BlockIDStr) => (block: Block) => {
                this.doUpdateParent(block, newParent);
                this.doRebuildParents(block);
            };

            // Update target block
            targetBlock.withMutation(() => {
                targetBlock.setContent(new MarkdownContent({
                    type: 'markdown',
                    data: newContent,
                    links,
                }));

                targetBlock.setItems(items);

                if (sourceBlock.parent === targetBlock.id) {
                    targetBlock.removeItem(sourceBlock.id);
                }
            });

            this.doPut([targetBlock]);

            // Update the "parent" & "parents" properties of the children (recursively)
            directChildrenBlocks.forEach(updateParent(targetBlock.id));
            this.idsToBlocks(nestedChildrenIDs).forEach(this.doRebuildParents.bind(this));

            // Delete the source block
            sourceBlock.withMutation(() => {
                // TODO: This is a bit ugly but we're doing this to avoid doDelete from bumping up
                // the mutation number after we just did in the case of merging a child with its parent
                if (sourceBlock.parent) {
                    const parent = this._index[sourceBlock.parent];
                    parent.withMutation(() => {
                        parent.removeItem(sourceBlock.id);
                        sourceBlock.setParent(undefined);
                        sourceBlock.setItems([]);
                    });
                }
            });
            this.doPut([sourceBlock]);
            this.doDelete([sourceBlock.id]);

            this.setActiveWithPosition(targetBlock.id, offset);

            return undefined;
        };

        return this.doUndoPush('mergeBlocks', [source, target], redo);

    }

    @action private doRebuildParents(block: Block) {
        block.withMutation(() => block.setParents(this.pathToBlock(block.id).map(b => b.id)));
        this.doPut([block]);
    }

    @action private doUpdateParent(block: Block, newParentID: BlockIDStr) {
        block.withMutation(() => block.setParent(newParentID));
        this.doPut([block]);
    }

    /*
     * Build the *parents* property of a block
     * by traversing parents all the way up the tree.
     */
    public pathToBlock(blockID: BlockIDStr): ReadonlyArray<Block> {
        const result: Block[] = [];

        let block = this._index[blockID];

        while (block && block.parent) {
            const parent = this._index[block.parent];
            if (parent) {
                result.unshift(parent);
            }
            block = parent;
        }

        return result;
    }

    /**
     * Create a new named block but only when a block with this name does not exist.
     *
     * The 'ref' block is used to compute the namespace in which this blocks
     * should be stored.
     *
     */
    @action public doCreateNewNamedBlock(opts: ICreateNewNamedBlockOpts): BlockIDStr {

        // NOTE that the ID always has to be random. We can't make it a hash
        // based on the name as the name can change.
        const newBlockID = opts.newBlockID || Hashcodes.createRandomID();

        const existingBlock = this.getBlockByName(BlockTextContentUtils.getTextContentMarkdown(opts.content));

        if (existingBlock) {
            return existingBlock.id;
        }


        const createNewBlock = (): IBlock => {

            const computeNamespace = (): NamespaceIDStr => {

                if (opts?.ref) {

                    const refBlock = this.getBlock(opts.ref);

                    if (! refBlock) {
                        throw new Error("Reference block doesn't exist");
                    }

                }

                if (opts?.nspace) {
                    return opts.nspace;
                }

                return this.uid;

            }


            const now = ISODateTimeStrings.create();
            const nspace = computeNamespace();

            return {
                id: newBlockID,
                nspace,
                uid: this.uid,
                root: newBlockID,
                parent: undefined,
                parents: [],
                content: opts.content,
                created: now,
                updated: now,
                items: {},
                mutation: 0
            };

        };

        const newBlock = createNewBlock();

        this.doPut([newBlock]);

        return newBlockID;
    }

    @action public createNewNamedBlock(opts: ICreateNewNamedBlockOpts): BlockIDStr {

        const newBlockID = Hashcodes.createRandomID();

        const redo = (): BlockIDStr => {
            return this.doCreateNewNamedBlock({...opts, newBlockID});
        };

        return this.doUndoPush('createNewNamedBlock', [newBlockID], redo);

    }

    public deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>) {

        const redo = () => {
            this.doDelete(blockIDs);
        }

        return this.doUndoPush('deleteBlocks', blockIDs, redo);

    }

    @action public renameBlock(id: BlockIDStr, newName: MarkdownStr) {

        const block = this.getBlock(id);

        if (! block) {
            return;
        }

        if (block.content.type !== 'name') {
            throw new Error(`Not allowed rename block of type "${block.content.type}"`);
        }

        const redo = () => {

            const block = this.getBlockForMutation(id) as Block<NameContent>;

            if (block) {

                delete this._indexByName[block.content.data.toLowerCase()];
                this._indexByName[newName.toLowerCase()] = id;

                block.withMutation(() => {
                    block.setContent(new NameContent({ type: 'name', data: newName }));
                });

                this.doPut([block]);

            }

        };

        return this.doUndoPush('setBlockContent', [id], redo);

    }

    @action public setBlockContent<C extends IBlockContent = IBlockContent>(id: BlockIDStr, content: C) {

        const redo = () => {

            const block = this.getBlockForMutation(id);

            if (block) {

                block.withMutation(() => {
                    block.setContent(content);
                });

                this.doPut([block]);

            }


        }

        return this.doUndoPush('setBlockContent', [id], redo);

    }

    @action public createLinkToBlock(sourceBlockID: BlockIDStr,
                                     targetName: BlockNameStr,
                                     content: MarkdownStr) {

        // if the existing target block exists, use that block name.
        const targetBlock = this.getBlockByName(targetName);

        const targetID = targetBlock?.id || Hashcodes.createRandomID();

        const redo = () => {

            console.log(`Creating link from ${sourceBlockID} to ${targetName}`)

            // TODO: we have to setContent here too but I need to figure out how
            // to get it from the element when we're changing it.

            const sourceBlock = this.getBlockForMutation(sourceBlockID);

            if (! sourceBlock) {
                throw new Error("Unable to find block: " + sourceBlockID);
            }

            if (! BlockPredicates.canHaveLinks(sourceBlock)) {
                throw new Error("Source block does not support links: " + sourceBlock.content.type);
            }

            // create the new block - the sourceID is used for the ref to compute the nspace.
            const targetBlockContent = new NameContent({
                type: 'name',
                data: targetName,
            });
            const targetBlockID = this.doCreateNewNamedBlock({
                newBlockID: targetID,
                nspace: sourceBlock.nspace,
                content: targetBlockContent,
            });

            sourceBlock.withMutation(() => {
                sourceBlock.content.addLink({id: targetBlockID, text: targetName});
                ;
                sourceBlock.setContent(BlockTextContentUtils.updateTextContentMarkdown(sourceBlock.content, content));
            });

            this.doPut([sourceBlock]);

            const cursorPos = this.cursorOffsetCapture();
            if (cursorPos) {
                this.setActiveWithPosition(cursorPos.id, cursorPos.pos);
            }
        };

        return this.doUndoPush('createLinkToBlock', [sourceBlockID, targetID], redo);
    }

    @action public updateBlocks(blocks: ReadonlyArray<IBlock>): void {
        this.doPut(blocks);
    }

    @action public createNewBlock(id: BlockIDStr, opts: INewBlockOpts = {}): ICreatedBlock {
        const newBlockID = Hashcodes.createRandomID();
        const redo = () => this.doCreateNewBlock(id, {...opts, newBlockID});
        return this.doUndoPush('createNewBlock', [id, newBlockID], redo);
    }

    @action public styleSelectedBlocks(style: DOMBlocks.MarkdownStyle): void {
        const selectedIDs = this.selectedIDs();
        const ids = selectedIDs.flatMap(id => this.computeLinearTree(id, { includeInitial: true }));
        const textBlocks = this.idsToBlocks(ids).filter(BlockPredicates.isEditableBlock);

        if (textBlocks.length === 0) {
            return;
        }


        const applyStyle = (style: DOMBlocks.MarkdownStyle) => (block: Block<TextContent>) => {
            DOMBlocks.applyStyleToBlock(block.id, style);
            const blockElem = DOMBlocks.getBlockElement(block.id);
            if (blockElem) {
                const div = BlockContentCanonicalizer.canonicalizeElement(blockElem)
                const html = ContentEditableWhitespace.trim(div.innerHTML);
                const markdown = MarkdownContentConverter.toMarkdown(html);
                block.withMutation(() => {
                    const content = block.content.toJSON();
                    block.setContent({ ...content, data: markdown });
                });
                this.doPut([block]);
            }
        };

        const redo = () => {
            textBlocks.forEach(applyStyle(style));
        };

        return this.doUndoPush('styleSelectedBlocks', textBlocks.map(({ id }) => id), redo);
    }

    /**
     * Create a new block in reference to the block with given ID.
     */
    @action public doCreateNewBlock(id: BlockIDStr, opts: INewBlockOpts = {}): ICreatedBlock {

        // *** we first have to compute the new parent this has to be computed
        // based on the expansion tree because if the current block setup is like:
        //
        // - first
        // - second
        //
        // and we are creating a block on 'first' then the new block should be
        // between first and second like:
        //
        //
        // - first
        // - *new block*
        // - second
        //
        // However if we have:
        //
        // - first
        //     - first child item
        // - second
        //
        // then we have to create it like:
        // - first
        //     - *new block*
        //     - first child item
        // - second

        // create the newBlock ID here so that it can be reliably used in undo/redo operations.
        const newBlockID = opts.newBlockID || Hashcodes.createRandomID();
        // ... we also have to keep track of the active note ... right?

        /**
         * A new block instruction that creates the block relative to a sibling
         * and provides the parent.
         */
        interface INewBlockPositionRelative {
            readonly type: 'relative';
            readonly parentBlock: Block;
            readonly ref: BlockIDStr;
            readonly pos: NewChildPos;
        }

        interface INewBlockPositionFirstChild {
            readonly type: 'first-child';
            readonly parentBlock: Block;
        }

        type INewBlockPosition = INewBlockPositionFirstChild | INewBlockPositionRelative;

        const parseLinksFromContent = (origLinks: ReadonlyArray<IBlockLink>, content: string): ReadonlyArray<IBlockLink> => {
            const map = origLinks
                .reduce((map, link) => map.set(link.text, link), new Map<string, IBlockLink>());
            return [...content.matchAll(WikiLinksToMarkdown.WIKI_LINK_REGEX)]
                .map(([, text]) => map.get(text))
                .filter((link): link is NonNullable<typeof link> => !!link);
        };

        const computeNewBlockPosition = (): INewBlockPosition => {

            const computeNextLinearExpansionID = () => {
                const linearExpansionTree = this.computeLinearTree(id, {expanded: true});
                return Arrays.first(linearExpansionTree);
            };

            const nextSiblingID = this.nextSibling(id);
            const nextLinearExpansionID = computeNextLinearExpansionID();

            const createNewBlockPositionRelative = (ref: BlockIDStr, pos: NewChildPos): INewBlockPositionRelative => {

                const block = this.getBlockForMutation(ref)!;
                const parentBlock = this.getBlockForMutation(block.parent!)!;

                return {
                    type: 'relative',
                    parentBlock,
                    ref,
                    pos
                };

            };

            const block = this.getBlockForMutation(id)!;
            const hasChildren = this.children(block.id).length > 0;

            // Block has no parent (in the case of a root block), or a block that has children
            // with suffix of an empty string, and annotation blocks
            if (
                opts.asChild
                || ! block.parent
                || (hasChildren && split?.suffix === '' && this.isExpanded(block.id))
                || BlockPredicates.isAnnotationBlock(block)
            ) {
                return {
                    type: 'first-child',
                    parentBlock: block
                };
            }

            if (nextSiblingID && split !== undefined) {
                return createNewBlockPositionRelative(nextSiblingID, 'before')
            } else if (nextLinearExpansionID && split === undefined) {
                return createNewBlockPositionRelative(nextLinearExpansionID, 'before')
            } else {
                return createNewBlockPositionRelative(id, 'after');
            }

        };

        const createNewBlock = (parentBlock: Block): IBlock => {
            const now = ISODateTimeStrings.create()

            const items = newBlockInheritItems ? currentBlock.items : {};

            const data = split?.suffix || '';
            const content = opts.content || {
                type: 'markdown',
                data,
                links: parseLinksFromContent(links, data),
                mutator: DeviceIDManager.DEVICE_ID,
            };

            return {
                id: newBlockID,
                parent: parentBlock.id,
                parents: [...parentBlock.parents, parentBlock.id],
                nspace: parentBlock.nspace,
                uid: this.uid,
                root: parentBlock.root,
                content: Contents.create(content).toJSON(),
                created: now,
                updated: now,
                items,
                mutation: 0
            };

        };

        const currentBlock = this.getBlockForMutation(id)!;
        const getSplit = (): ISplitBlock | undefined => currentBlock.content.type === 'markdown' ? opts.split : undefined;
        const getLinks = (): ReadonlyArray<IBlockLink> => currentBlock.content.type === 'markdown' ? currentBlock.content.links : [];

        const split = getSplit();
        const links = getLinks();
        const newBlockInheritItems = split?.suffix !== undefined && split?.suffix !== '';

        const newBlockPosition = computeNewBlockPosition();

        const {parentBlock} = newBlockPosition;

        const newBlock = createNewBlock(parentBlock);

        const updateParent = (newParent: BlockIDStr) => (block: Block) => {
            this.doUpdateParent(block, newParent);
            this.doRebuildParents(block);
        };

        this.doPut([newBlock]);

        if (newBlockInheritItems) {
            const items = currentBlock.itemsAsArray;
            this.idsToBlocks(items).map(updateParent(newBlock.id));
            const nestedChildrenIDs = items.flatMap(item => this.computeLinearTree(item));
            this.idsToBlocks(nestedChildrenIDs).forEach(this.doRebuildParents.bind(this));
        }

        parentBlock.withMutation(() => {

            switch (newBlockPosition.type) {

                case "relative":
                    parentBlock.addItem(newBlock.id, newBlockPosition);
                    break;
                case "first-child":
                    parentBlock.addItem(newBlock.id, 'unshift');
                    break;

            }

        })

        currentBlock.withMutation(() => {

            if (split?.prefix !== undefined) {

                currentBlock.setContent({
                    type: 'markdown',
                    data: split.prefix,
                    links: parseLinksFromContent(links, split.prefix),
                });

                if (newBlockInheritItems) {
                    currentBlock.setItems([]);
                }

            }

        });

        this.doPut([currentBlock, parentBlock]);

        // Expand the parent if the new block is being added as a child
        if (newBlockPosition.type === "first-child") {
            this.expand(currentBlock.id);
        }

        // Copy the expand state from the old block to the new one if the new one is inheriting the items
        if (newBlockInheritItems) {
            const isExpanded = this._expanded[currentBlock.id]
            this[isExpanded ? 'expand' : 'collapse'](newBlock.id);
        }

        this.setActiveWithPosition(newBlock.id, 'start');

        return {
            id: newBlock.id,
            parent: newBlock.parent!
        };
    }

    public cursorOffsetCapture(): IActiveBlock | undefined {
        const focusedBlock = DOMBlocks.getFocusedBlock();

        if (focusedBlock) {

            const focusedBlockID = DOMBlocks.getBlockID(focusedBlock);

            if (focusedBlockID) {
                const pos = CursorPositions.computeCurrentOffset(focusedBlock);

                return {
                    id: focusedBlockID,
                    pos,
                    nonce: ActiveBlockNonces.create()
                };
            }

        }

        return this._active;
    }

    public cursorOffsetRestore(active: IActiveBlock | undefined) {

        if (active?.id) {

            this._active = {
                ...active
            }

        }

    }

    /**
     * @deprecated Redundant code (same as isUnIndentable)
     */
    public isIndentable(root: BlockIDStr, id: BlockIDStr): boolean {

        const block = this.getBlock(id);

        if (! block) {
            return false;
        }

        if (! block.parent || id === root) {
            return false;
        }

        const parentBlock = this.getBlock(block.parent);

        if (! parentBlock) {
            // this is a bug and shouldn't happen
            return false;
        }

        return true;

    }

    /**
     * @deprecated Selections do this by default
     */
    private computeSelectedIndentableBlockIDs(root: BlockIDStr): ReadonlyArray<BlockIDStr> {

        const selectedRoots = this.computeSelectedRoots();

        return selectedRoots
                   .filter(current => this.isIndentable(root, current.id))
                   .map(current => current.id);

    }

    /**
     * Make the active block a child of the prev sibling.
     *
     * @return The new parent BlockID or the code as to why it couldn't be re-parented.
     */
    public indentBlock(root: BlockIDStr, id: BlockIDStr): ReadonlyArray<DoIndentResult> {

        if (! root) {
            throw new Error("No root");
        }

        const computeTargetIdentifiers = () => {
            return this.hasSelected() ? this.selectedIDs() : [id];
        };

        const targetIdentifiers = computeTargetIdentifiers();

        const undoIdentifiers
            = BlocksStoreUndoQueues.expandToParentAndChildren(this, [root])

        const doExec = (id: BlockIDStr): DoIndentResult => {

            console.log("doIndent: " + id);

            const block = this._index[id];

            if (! block) {
                return {error: 'no-block'};
            }

            if (! block.parent || id === root) {
                return {error: 'no-parent'};
            }

            const parentBlock = this._index[block.parent];

            if (! parentBlock) {
                console.warn("No parent block for id: " + block.parent);
                return {error: 'no-parent-block'};
            }

            if (BlockPredicates.isAnnotationBlock(block)) {
                return {error: 'annotation-block'};
            }

            const parentItems = (parentBlock.itemsAsArray || []);

            // figure out the sibling index in the parent
            const siblingIndex = parentItems.indexOf(id);

            if (siblingIndex > 0) {

                const newParentID = parentItems[siblingIndex - 1];

                const newParentBlock = this._index[newParentID];

                // *** remove myself from my parent

                parentBlock.withMutation(() => {
                    parentBlock.removeItem(id);
                })

                // ***: add myself to my newParent

                newParentBlock.withMutation(() => {
                    newParentBlock.addItem(id);
                })

                block.withMutation(() => {
                    block.setParent(newParentBlock.id);
                    block.setParents([...newParentBlock.parents, newParentBlock.id]);
                });

                const nestedChildrenIDs = this.computeLinearTree(block.id);
                this.idsToBlocks(nestedChildrenIDs).forEach(this.doRebuildParents.bind(this));

                this.doPut([block, newParentBlock, parentBlock]);

                this.expand(newParentID);

                return {value: newParentBlock.id};

            } else {
                return {error: 'no-sibling'};
            }

        }

        const cursorOffset = this.cursorOffsetCapture();

        const redo = () => {

            try {

                return targetIdentifiers.map(id => doExec(id));

            } finally {
                this.cursorOffsetRestore(cursorOffset);
            }

        }

        return this.doUndoPush('indentBlock', undoIdentifiers, redo);

    }

    /**
     * @deprecated This code is kind of redundant because we're doing the same checks inside of indentBlock/unIndentBlock
     */
    public isUnIndentable(root: BlockIDStr, id: BlockIDStr) {

        const block = this.getBlock(id);

        if (! block) {
            return false;
        }

        if (! block.parent || id === root) {
            // this is the root...
            return false;
        }

        if (block.parent === root) {
            return false;
        }

        const parent = this.getBlock(block.parent);
        
        // If the parent is an annotation then we can't unindent
        // Because the parent of that annotation is a document which only allows annotations beneath it
        if (! parent || BlockPredicates.isAnnotationHighlightBlock(parent)) {
            return false;
        }

        return true;

    }


    /**
     * @deprecated Selections do this by default now.
     */
    private computeSelectedUnIndentableBlockIDs(root: BlockIDStr): ReadonlyArray<BlockIDStr> {

        const selectedRoots = this.computeSelectedRoots();
        return selectedRoots.filter(current => this.isUnIndentable(root, current.id))
                            .map(current => current.id);

    }

    public unIndentBlock(root: BlockIDStr, id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {

        if (! root) {
            throw new Error("No root");
        }

        const computeTargetIdentifiers = () => {
            return this.hasSelected() ? this.selectedIDs() : [id];
        };

        const targetIdentifiers = computeTargetIdentifiers();

        if (targetIdentifiers.length === 0) {
            return [];
        }

        const undoIdentifiers
            = BlocksStoreUndoQueues.expandToParentAndChildren(this, [root])

        const doExec = (id: BlockIDStr): DoUnIndentResult => {

            console.log("doUnIndent: " + id);

            const block = this._index[id];

            if (! block) {
                return {error: 'no-block'};
            }

            if (! block.parent || id === root) {
                return {error: 'no-parent'};
            }

            const parentBlock = this._index[block.parent];

            if (! parentBlock) {
                return {error: 'no-parent-block'};
            }
            
            if (BlockPredicates.isAnnotationHighlightBlock(parentBlock)) {
                return {error: 'grandparent-is-document'};
            }

            if (! parentBlock.parent || block.parent === root) {
                return {error: 'no-parent-block-parent'};
            }

            const newParentBlock = this._index[parentBlock.parent];

            if (! newParentBlock) {
                return {error: 'no-parent-block-parent-block'};
            }

            block.withMutation(() => {
                block.setParent(newParentBlock.id);
                block.setParents([...newParentBlock.parents, newParentBlock.id]);
            })

            newParentBlock.withMutation(() => {
                newParentBlock.addItem(id, {pos: 'after', ref: parentBlock.id});
            })

            parentBlock.withMutation(() => {
                parentBlock.removeItem(id);
            })

            this.doPut([block, newParentBlock, parentBlock]);

            return {value: id};

        };

        const cursorOffset = this.cursorOffsetCapture();

        const redo = () => {

            try {

                return targetIdentifiers.map(id => doExec(id));

            } finally {
                this.cursorOffsetRestore(cursorOffset);
            }

        }

        return this.doUndoPush('unIndentBlock', undoIdentifiers, redo);

    }

    public blockIsEmpty(id: BlockIDStr): boolean {

        const block = this._index[id];

        if (BlockPredicates.isEditableBlock(block)) {
            return BlockTextContentUtils.getTextContentMarkdown(block.content).trim() === '';
        }

        return false;

    }

    public createBlockContentStructure(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlockContentStructure> {
        const construct = (block: Block): IBlockContentStructure => {
            return {
                content: block.content.toJSON(),
                children: this.idsToBlocks(block.itemsAsArray).map(construct)
            };
        };

        return this.idsToBlocks(ids).map(construct);
    }

    @action public doDelete(blockIDs: ReadonlyArray<BlockIDStr>, opts: IDoDeleteOpts = {}) {

        interface NextActive {
            readonly active: BlockIDStr;
            readonly activePos: NavPosition;
        }

        const computeNextActive = (): NextActive | undefined => {

            const blockID = blockIDs[0];
            const block = this._index[blockID];

            if (! block) {
                console.log("No block for ID: " + blockID)
                return undefined;
            }

            if (! block.parent) {
                console.log("No parent for ID: " + blockID)
                return undefined;
            }

            // Collapse all the deleted blocks so we don't get their children in the expansion tree
            blockIDs.forEach((id) => this.collapse(id));
            const linearExpansionTree = this.computeLinearTree(block.parent, {
                expanded: true,
                root: block.parent,
            });

            const deleteIndexes = arrayStream(blockIDs)
                .map(current => linearExpansionTree.indexOf(current))
                .filter(current => current !== -1)
                .sort((a, b) => a - b)
                .collect()

            if (deleteIndexes.length === 0) {
                return undefined;
            }

            const head = linearExpansionTree.slice(0, Arrays.first(deleteIndexes));
            const tail = linearExpansionTree.slice(Arrays.last(deleteIndexes)! + 1);

            const tailFirst = Arrays.first(tail);

            if (tailFirst !== undefined) {
                return {
                    active: tailFirst,
                    activePos: 'start'
                }
            }

            const headLast = Arrays.last(head);

            if (headLast !== undefined) {
                return {
                    active: headLast,
                    activePos: 'start'
                }
            }

            return {
                active: block.parent,
                activePos: 'start'
            };

        }

        const handleDelete = (blocks: ReadonlyArray<BlockIDStr>) => {

            let deleted: number = 0;

            for (const blockID of blocks) {

                const block = this._index[blockID];

                if (block) {

                    // *** first delete all children,  We have to do this first
                    // or else they won't have parents.

                    if (! opts.noDeleteItems) {
                        handleDelete(block.itemsAsArray);
                    }

                    // *** delete the id for this block from the parents items.

                    if (block.parent) {

                        const parentBlock = this._index[block.parent];

                        if (! parentBlock) {
                            console.warn(`handleDelete: Block ${block.id} (${blockID}) has no parent for ID ${block.parent}`);
                            continue;
                        }

                        parentBlock.withMutation(() => {
                            parentBlock.removeItem(block.id);
                        })

                    }

                    // we have to capture this before we delete the node
                    // and keep a snapshot of it
                    const inboundIDs = [...this.reverse.get(block.id)];

                    // *** delete the block from the index
                    delete this._index[block.id];

                    // *** delete the block from name index by name.
                    if (BlockPredicates.isNamedBlock(block)) {
                        const name = BlockTextContentUtils.getTextContentMarkdown(block.content);
                        delete this._indexByName[name.toLowerCase()];
                    }

                    // *** delete the reverse index for this item

                    for (const inboundID of inboundIDs) {
                        this.reverse.remove(block.id, inboundID);
                    }

                    // *** Delete the references to other items
                    if (block.content.type === 'markdown') {
                        for (const link of block.content.links) {
                            this.reverse.remove(link.id, block.id);
                        }
                    }

                    if (block.content.type === 'document') {
                        delete this._indexByDocumentID[block.content.docInfo.fingerprint];
                    }

                    this.collapse(blockID);

                    ++deleted;

                }

            }

            return deleted;

        };

        if (blockIDs.length === 0) {
            return;
        }

        const nextActive = computeNextActive();

        if (handleDelete(blockIDs) > 0) {

            if (nextActive) {
                this.setActiveWithPosition(nextActive.active, nextActive.activePos);
            }

            // we have to clear now because the blocks we deleted might have been selected
            this.clearSelected('doDelete');

        }

    }

    @action public handleBlocksPersistenceSnapshot(snapshot: IBlockCollectionSnapshot) {

        // console.log("Handling BlocksStore snapshot: ", snapshot);

        for (const docChange of snapshot.docChanges) {

            switch(docChange.type) {

                case "added":
                    this.doPut([docChange.data]);
                    break;

                case "modified":
                    this.doPut([docChange.data]);
                    break;

                case "removed":
                    this.doDelete([docChange.data.id]);
                    break;

            }

        }

        this._hasSnapshot = true;

    }

    @action public handleBlockExpandSnapshot(snapshot: IBlockExpandCollectionSnapshot) {

        for (const docChange of snapshot.docChanges) {

            switch(docChange.type) {

                case "added":
                    this.doExpand(docChange.id, true);
                    break;

                case "removed":
                    this.doExpand(docChange.id, false);
                    break;

            }

        }

        this._hasSnapshot = true;

    }

    public requiredAutoUnIndent(root: BlockIDStr, id: BlockIDStr): boolean {

        const block = this.getBlock(id);

        if (! block) {
            return false;
        }

        if (! this.blockIsEmpty(id)) {
            return false;
        }

        if (! block.parent) {
            return false;
        }

        const parentBlock = this.getBlock(block.parent);

        if (! parentBlock || BlockPredicates.isAnnotationBlock(parentBlock)) {
            return false;
        }

        if (root === parentBlock.id) {
            return false;
        }

        return parentBlock.itemsAsArray.indexOf(id) === parentBlock.itemsAsArray.length - 1;

    }

    @action public moveBlocks(ids: ReadonlyArray<BlockIDStr>, delta: number) {
        const blocks = this.idsToBlocks(ids);

        if (blocks.length === 0) {
            return;
        }

        const parentID = blocks[0].parent;

        if (!parentID) {
            return console.log("moveBlock: can\'t move blocks with no parents");
        }

        const parent = this._index[parentID];
        const allHaveSameParent = blocks.every(block => block.parent === parent.id);

        if (! allHaveSameParent) { // This technically would never happen because our selection system only allows siblings
            throw new Error("Only sibling blocks can be moved");
        }

        const idsToPositionsMap = (ids: ReadonlyArray<BlockIDStr>) =>
            ids.reduce((m, x, i) => m.set(x, i), new Map<string, number>())

        const items = parent.itemsAsArray;
        const itemPositions = idsToPositionsMap(items);
        const orderedIds = ids
            .map<[string, number]>(x => [x, itemPositions.get(x)!])
            .sort(([, ai], [, bi]) => ai - bi)
            .map(([x]) => x);

        const redo = () => {
            const pos = delta > 0 ? 'after' : 'before';
            const ids = delta > 0 ? [...orderedIds].reverse() : orderedIds;
            const idPositions = idsToPositionsMap(orderedIds);

            const updatePosition = (blockID: BlockIDStr) => {
                const idx = idPositions.get(blockID)!;
                const min = idx;
                const max = (items.length - 1) - (ids.length - 1 - idx);
                const newIdx = Math.max(min, Math.min(itemPositions.get(blockID)! + delta, max));
                const siblingID = parent.itemsAsArray[newIdx] as string | undefined;
                if (siblingID && siblingID !== blockID) {
                    parent.removeItem(blockID);
                    parent.addItem(blockID, {ref: siblingID, pos});
                }
            };

            parent.withMutation(() => ids.forEach(updatePosition));

            this.doPut([parent]);
        };

        this.doUndoPush('moveBlock', [parentID], redo);

    }

    public idsToBlocks(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<Block> {
        return ids.map(id => this.getBlock(id))
            .filter((block): block is Block => !!block);
    }

    /**
     * Get the blocks that apply here and convert them to JSON objects.
     */
    public createSnapshot(identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {
        return arrayStream(identifiers.map(id => this.getBlock(id)))
            .filterPresent()
            .map(current => current.toJSON())
            .collect();
    }

    /**
     * Create a snapshot but without the mutation property because for some use
     * cases that might be irrelevant. Usually testing.
     */
    public createSnapshotWithoutMutation(identifiers: ReadonlyArray<BlockIDStr>): ReadonlyArray<Exclude<IBlock, 'mutation'>> {

        const removeMutation = (block: IBlock): Exclude<IBlock, 'mutation'> => {
            delete (block as any).mutation;
            return block;
        }

        return this.createSnapshot(identifiers)
            .map(current => removeMutation(current));

    }

    private doUndoPush<T>(id: IDStr,
                          identifiers: ReadonlyArray<BlockIDStr>,
                          redoDelegate: () => T): T {

        if (ENABLE_UNDO_TRACING) {
            console.log(`doUndoPush: ${id} `, new Error("UNDO_QUEUE_PUSH"));
        }

        return BlocksStoreUndoQueues.doUndoPush(this, this.undoQueue, identifiers, mutations => this.blocksPersistenceWriter(mutations), redoDelegate);
    }

    public undo() {
        return this.undoQueue.undo();
    }

    public redo() {
        return this.undoQueue.redo();
    }

}

export const [BlocksStoreProvider, useBlocksStoreDelegate] = createReactiveStore(() => {
    const {uid} = useBlocksStoreContext();
    const undoQueue = useUndoQueue();
    const blocksPersistenceWriter = useBlocksPersistenceWriter();
    const blockExpandPersistenceWriter = useBlockExpandPersistenceWriter()

    const blocksStore = React.useMemo(() => new BlocksStore(uid, undoQueue, blocksPersistenceWriter, blockExpandPersistenceWriter),
                                      [blockExpandPersistenceWriter, blocksPersistenceWriter, uid, undoQueue]);

    useBlockCollectionSnapshots((snapshot) => {
        blocksStore.handleBlocksPersistenceSnapshot(snapshot);
    });

    useBlockExpandCollectionSnapshots((snapshot) => {
        blocksStore.handleBlockExpandSnapshot(snapshot);
    });

    return blocksStore;
})

export function useBlocksStore(): IBlocksStore {
    const delegate = useBlocksStoreDelegate();
    // return new TracingBlocksStore(delegate);
    return delegate;
}
