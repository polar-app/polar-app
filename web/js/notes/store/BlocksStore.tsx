import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {action, computed, makeObservable, observable} from "mobx"
import {IDStr} from "polar-shared/src/util/Strings";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Arrays} from "polar-shared/src/util/Arrays";
import {BlockTargetStr} from "../NoteLinkLoader";
import {isPresent} from "polar-shared/src/Preconditions";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {IBlock, UIDStr} from "./IBlock";
import {ReverseIndex} from "./ReverseIndex";
import {Block} from "./Block";
import { arrayStream } from "polar-shared/src/util/ArrayStreams";
import { Numbers } from "polar-shared/src/util/Numbers";
import {CursorPositions} from "../contenteditable/CursorPositions";
import {useBlocksStoreContext} from "./BlockStoreContextProvider";
import {IBlocksStore} from "./IBlocksStore";
import {IImageContent} from "../content/IImageContent";
import { BlockPredicates } from "./BlockPredicates";
import {MarkdownContent} from "../content/MarkdownContent";
import {NameContent} from "../content/NameContent";
import { ImageContent } from "../content/ImageContent";
import { IMarkdownContent } from "../content/IMarkdownContent";
import {INameContent} from "../content/INameContent";
import { Contents } from "../content/Contents";
import { IBaseBlockContent } from "../content/IBaseBlockContent";
import {UndoQueues2} from "../../undo/UndoQueues2";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import deepEqual from "deep-equal";
import {useUndoQueue} from "../../undo/UndoQueueProvider2";

export type BlockIDStr = IDStr;
export type BlockNameStr = string;

export type BlockType = 'name' | 'markdown' | 'image';

export type BlocksIndex = {[id: string /* BlockIDStr */]: Block};
export type BlocksIndexByName = {[name: string /* BlockNameStr */]: BlockIDStr};

export type ReverseBlocksIndex = {[id: string /* BlockIDStr */]: BlockIDStr[]};

export type StringSetMap = {[key: string]: boolean};

// export type NoteContent = string | ITypedContent<'markdown'> | ITypedContent<'name'>;
export type IBlockContent = IMarkdownContent | INameContent | IImageContent;
export type BlockContent = (MarkdownContent | NameContent | ImageContent) & IBaseBlockContent;
// export type BlockContent = MarkdownContent | NameContent ;

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
}

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

export type DoIndentResult = IMutation<'no-block' | 'no-parent' | 'no-parent-block' | 'no-sibling', BlockIDStr>;

export type DoUnIndentResult = IMutation<'no-block' | 'no-parent' | 'no-parent-block' | 'no-parent-block-parent' | 'no-parent-block-parent-block', BlockIDStr>

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

export type DropPosition = 'top' | 'bottom';

export interface IDropTarget {
    readonly id: BlockIDStr;
    readonly pos: DropPosition;
}

export namespace ActiveBlockNonces {

    let value = 0;

    export function create() {
        return value++;
    }

}

/**
 * The RAW store with just the data that we can use to restore undo/redo data.
 */
export interface IBlocksStoreSnapshot {

    _index: BlocksIndex;

    _indexByName: BlocksIndexByName;

    // FIXME: this won't work with restore...
    _reverse: ReverseIndex;

    root: BlockIDStr | undefined;

    _active: IActiveBlock | undefined;

    _expanded: StringSetMap;

    _selected: StringSetMap;

    _dropTarget: IDropTarget | undefined;

    _dropSource: BlockIDStr | undefined;

    _selectedAnchor: IDStr | undefined;

}

export class BlocksStore implements IBlocksStore {

    private readonly uid: UIDStr;

    private readonly undoQueue ;

    @observable _index: BlocksIndex = {};

    @observable _indexByName: BlocksIndexByName = {};

    /**
     * The reverse index so that we can build references to this node.
     */
    @observable _reverse: ReverseIndex = new ReverseIndex();

    /**
     * The current root block
     */
    @observable public root: BlockIDStr | undefined = undefined;

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

    constructor(uid: UIDStr, undoQueue: UndoQueues2.UndoQueue) {
        this.uid = uid;
        this.root = undefined;
        this.undoQueue = undoQueue;
        makeObservable(this);
    }

    @computed get index() {
        return this._index;
    }

    @computed get indexByName() {
        return this._indexByName;
    }

    /**
     * Get all the nodes by name.
     */
    getNamedNodes(): ReadonlyArray<string> {
        return Object.keys(this._indexByName);
    }

    @computed get reverse() {
        return this._reverse;
    }

    @computed get expanded() {
        return this._expanded;
    }

    // @computed get root() {
    //     return this._root;
    // }

    @computed get active() {
        return this._active;
    }

    public selected() {
        return this._selected;
    }

    public selectedIDs() {
        return Object.keys(this._selected);
    }

    /**
     * Compute notes that are the selected roots that have no parent that is
     * also selected.
     */
    public computeSelectedRoots() {
        const selected = this.selectedIDs();

        return selected.map(current => this.getBlock(current))
                       .filter(current => current !== undefined)
                       .map(current => current!)
                       .filter(current => current.parent === undefined || ! selected.includes(current.parent))

    }

    @action public clearSelected(reason: string) {
        this._selected = {};
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

    /**
     * Return true if the given block is active.
     */
    public isActive(id: BlockIDStr): boolean {
        return this._active?.id === id;
    }

    public lookup(blocks: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock> {

        return blocks.map(current => this._index[current])
            .filter(current => current !== null && current !== undefined);

    }

    public lookupReverse(id: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this._reverse.get(id);
    }

    @action public doPut(blocks: ReadonlyArray<IBlock>, opts: DoPutOpts = {}) {

        for (const blockData of blocks) {

            const block = new Block(blockData);
            this._index[blockData.id] = block;

            if (blockData.content.type === 'name') {
                this._indexByName[blockData.content.data] = block.id;
            }

            for (const link of block.links) {
                this._reverse.add(link, block.id);
            }

        }

        this._active = opts.newActive ? opts.newActive : this._active;

        if (opts.newExpand) {
            this._expanded[opts.newExpand] = true;
        }

    }

    public hasSelected(): boolean {
        return Object.keys(this._selected).length > 0;
    }

    public containsBlock(id: BlockIDStr): boolean {
        return this.getBlock(id) !== undefined;
    }

    public getBlock(id: BlockIDStr): Block | undefined {
        return this._index[id] || undefined;
    }

    public getBlockContentData(id: BlockIDStr): string | undefined {

        const block = this.getBlock(id);

        if (! block?.content) {
            return ''
        }

        return BlockPredicates.isTextBlock(block) ? block.content.data : '';

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

            const idx = parent.items.indexOf(id);

            if (idx !== -1) {

                switch (type) {

                    case "prev":
                        return Arrays.prevSibling(parent.items, idx);
                    case "next":
                        return Arrays.nextSibling(parent.items, idx);

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


    public getBlockByTarget(target: BlockIDStr | BlockTargetStr): Block | undefined {

        const blockByID = this._index[target];

        if (blockByID) {
            return blockByID;
        }

        const blockRefByName = this._indexByName[target];

        if (blockRefByName) {
            return this._index[blockRefByName] || undefined;
        }

        return undefined;

    }

    public getBlockByName(name: BlockNameStr): Block | undefined {

        const blockRefByName = this._indexByName[name];

        if (blockRefByName) {
            return this._index[blockRefByName] || undefined;
        }

        return undefined;

    }


    public getActiveBlock(id: BlockIDStr): Block | undefined {

        const active = this._active;

        if ( ! active) {
            return undefined;
        }

        return this._index[id] || undefined;
    }

    public filterByName(filter: string): ReadonlyArray<BlockNameStr> {

        filter = filter.toLowerCase();

        return Object.keys(this._indexByName)
            .filter(key => key.toLowerCase().indexOf(filter) !== -1);

    }


    @action public expand(id: BlockIDStr) {
        this._expanded[id] = true;
        this.setActiveWithPosition(id, 'start');
    }

    @action public collapse(id: BlockIDStr) {
        delete this._expanded[id];
        this.setActiveWithPosition(id, 'start');
    }

    public toggleExpand(id: BlockIDStr) {

        if (this._expanded[id]) {
            this.collapse(id);
        } else {
            this.expand(id);
        }

    }

    @action public setSelectionRange(fromBlock: BlockIDStr, toBlock: BlockIDStr) {

        if (! this.root) {
            throw new Error("No root");
        }

        const linearExpansionTree = [this.root, ...this.computeLinearExpansionTree2(this.root)];

        const fromBlockIdx = linearExpansionTree.indexOf(fromBlock);
        const toBlockIdx = linearExpansionTree.indexOf(toBlock);

        if (fromBlockIdx === -1) {
            throw new Error("selectedAnchor not found: " + fromBlock);
        }

        if (toBlockIdx === -1) {
            throw new Error("toBlockIdx not found");
        }

        const min = Math.min(fromBlockIdx, toBlockIdx);
        const max = Math.max(fromBlockIdx, toBlockIdx);

        const newSelected
            = arrayStream(Numbers.range(min, max))
                 .map(current => linearExpansionTree[current])
                 .toMap2(current => current, () => true);

        this._selected = newSelected;

    }

    @action public doNav(delta: 'prev' | 'next',
                         pos: NavPosition,
                         opts: NavOpts): boolean {

        if (this.root === undefined) {
            console.warn("No currently active root");
            return false;
        }

        if (this._active === undefined) {
            console.warn("No currently active node");
            return false;
        }

        const rootBlock = Arrays.first(this.lookup([this.root]));

        if (! rootBlock) {
            console.warn("No block in index for ID: ", this.root);
            return false;
        }

        const items = [
            this.root,
            ...this.computeLinearExpansionTree(this.root)
        ];

        const childIndex = items.indexOf(this._active?.id);

        if (childIndex === -1) {
            console.warn(`Child ${this._active.id} not in block items`);
            return false;
        }

        const deltaIndex = delta === 'prev' ? -1 : 1;

        const activeIndexWithoutBound = childIndex + deltaIndex;
        const activeIndex = Math.min(Math.max(0, activeIndexWithoutBound), items.length -1);

        const newActive = items[activeIndex];

        if (opts.shiftKey) {

            if (this.hasSelected()) {
                this.setSelectionRange(this._selectedAnchor!, newActive);
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
            this._selected = {};
            this._selectedAnchor = undefined;
        }

        this.setActiveWithPosition(newActive, pos);

        return true;

    }

    public navPrev(pos: NavPosition, opts: NavOpts) {
        return this.doNav('prev', pos, opts);
    }

    public navNext(pos: NavPosition, opts: NavOpts) {
        return this.doNav('next', pos, opts);
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
    private computeLinearExpansionTree(id: BlockIDStr,
                                       root: boolean = true): ReadonlyArray<BlockIDStr> {

        const block = this._index[id];

        if (! block) {
            console.warn("computeLinearExpansionTree: No block: ", id);
            return [];
        }

        const isExpanded = root ? true : this._expanded[id];

        if (isExpanded) {
            const items = (block.items || []);

            const result = [];

            for (const item of items) {
                result.push(item);
                result.push(...this.computeLinearExpansionTree(item, false));
            }

            return result;

        } else {
            return [];
        }

    }

    private computeLinearExpansionTree2(id: BlockIDStr): ReadonlyArray<BlockIDStr> {

        const block = this._index[id];

        if (! block) {
            console.warn("computeLinearExpansionTree2: No block: ", id);
            return [];
        }

        const isExpanded = this._expanded[id] || id === this.root;

        if (isExpanded) {
            const items = (block.items || []);

            const result = [];

            for (const item of items) {
                result.push(item);
                result.push(...this.computeLinearExpansionTree(item, false));
            }

            return result;

        } else {
            return [];
        }

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

    @action public setRoot(root: BlockIDStr | undefined) {
        this.root = root;
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
    public canMerge(id: BlockIDStr): IBlockMerge | undefined {

        const prevSibling = this.prevSibling(id);

        if (prevSibling) {
            return {
                source: id,
                target: prevSibling
            }
        }

        const block = this.getBlock(id);

        if (block?.parent) {

            const parentBlock = this.getBlock(block.parent);

            if (parentBlock) {

                if (this.canMergeTypes(block, parentBlock)) {

                    return {
                        source: id,
                        target: block.parent
                    }

                }

                if (this.canMergeWithDelete(block, parentBlock)) {
                    return {
                        source: id,
                        target: block.parent
                    };
                }

            }

        }

        return undefined;

    }

    public canMergeTypes(sourceBlock: IBlock, targetBlock: IBlock): boolean {
        return targetBlock.content.type === sourceBlock.content.type;
    }

    public canMergeWithDelete(sourceBlock: IBlock, targetBlock: IBlock) {

        if (! this.canMergeTypes(sourceBlock, targetBlock)) {

            if (this.blockIsEmpty(sourceBlock.id)) {

                if (sourceBlock.parent === targetBlock.id) {

                    const firstChild = targetBlock.items.indexOf(sourceBlock.id) === 0;

                    if (firstChild) {
                        return true;
                    }

                }

            }

        }

        return false;

    }

    @action public mergeBlocks(target: BlockIDStr, source: BlockIDStr) {

        const targetBlock = this._index[target];
        const sourceBlock = this._index[source];

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

        const items = [...targetBlock.items, ...sourceBlock.items];
        const links = [...targetBlock.links, ...sourceBlock.links];

        const newContent = targetBlock.content.data + sourceBlock.content.data;

        targetBlock.setContent(new MarkdownContent({
            type: 'markdown',
            data: newContent
        }));
        targetBlock.setItems(items);
        targetBlock.setLinks(links);

        const deleteSourceBlock = () => {
            // we have to set items to an empty array or doDelete will also remove the children recursively.
            sourceBlock.setItems([]);
            this.doDelete([sourceBlock.id]);
        }

        deleteSourceBlock();

        this.setActiveWithPosition(targetBlock.id, offset);

        return undefined;

    }

    /**
     * Create a new named block but only when a block with this name does not exist.
     */
    @action public createNewNamedBlock(name: BlockNameStr, ref: BlockIDStr): BlockIDStr {

        const existingBlock = this.getBlockByName(name);

        if (existingBlock) {
            return existingBlock.id;
        }

        const createNewBlock = (): IBlock => {

            const refBlock = this.getBlock(ref);

            if (! refBlock) {
                throw new Error("Reference block doesn't exist");
            }

            const now = ISODateTimeStrings.create()
            return {
                id: Hashcodes.createRandomID(),
                nspace: refBlock.nspace,
                uid: this.uid,
                parent: undefined,
                content: Contents.create({
                    type: 'name',
                    data: name
                }),
                created: now,
                updated: now,
                items: [],
                links: []
            };
        };

        const newBlock = createNewBlock();

        this.doPut([newBlock]);

        return newBlock.id;

    }

    public deleteBlocks(blockIDs: ReadonlyArray<BlockIDStr>) {

        // const restoreBlocks =
        //     blockIDs.map(current => this.getBlock(current)!.toJSON());
        //
        // const redo = () => {
        //     this.doDelete(blockIDs);
        // }
        //
        // const undo = () => {
        //
        //     // FIXME: we also need to link it from the parent. and the position in the parent.. .
        //     this.doPut([restoreBlocks]);
        //
        // }

        this.doDelete(blockIDs);

    }

    /**
     * Create a new block in reference to the block with given ID.
     */
    @action public createNewBlock(id: BlockIDStr, opts: INewBlockOpts = {}): ICreatedBlock | undefined {

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

        const restoreBlock = this.getBlock(id)?.toJSON();

        // create the newBlock ID here so that it can be reliably used in undo/redo operations.
        const newBlockID = Hashcodes.createRandomID();
        // ... we also have to keep track of the active note ... right?

        const redo = () => {
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

            const computeNewBlockPosition = (): INewBlockPositionRelative | INewBlockPositionFirstChild => {

                const computeNextLinearExpansionID = () => {
                    const linearExpansionTree = this.computeLinearExpansionTree2(id);
                    return Arrays.first(linearExpansionTree);
                }

                const nextSiblingID = this.nextSibling(id);
                const nextLinearExpansionID = computeNextLinearExpansionID();

                const createNewBlockPositionRelative = (ref: BlockIDStr, pos: NewChildPos): INewBlockPositionRelative => {

                    const block = this.getBlock(ref)!;
                    const parentBlock = this.getBlock(block.parent!)!;

                    return {
                        type: 'relative',
                        parentBlock,
                        ref,
                        pos
                    };

                }

                if (nextSiblingID && split !== undefined) {
                    return createNewBlockPositionRelative(nextSiblingID, 'before')
                } else if (nextLinearExpansionID && split === undefined) {
                    return createNewBlockPositionRelative(nextLinearExpansionID, 'before')
                } else {

                    const block = this.getBlock(id)!;

                    if (block.parent) {

                        const parentBlock = this.getBlock(block.parent)!;

                        return {
                            type: 'relative',
                            parentBlock,
                            ref: id,
                            pos: 'after'
                        }

                    } else {

                        return {
                            type: 'first-child',
                            parentBlock: block
                        }

                    }

                }

            }

            const createNewBlock = (parentBlock: Block): IBlock => {
                const now = ISODateTimeStrings.create()

                const items = newBlockInheritItems ? currentBlock.items : [];

                const content = opts.content || {
                    type: 'markdown',
                    data: split?.suffix || ''
                };

                return {
                    id: newBlockID,
                    parent: parentBlock.id,
                    nspace: parentBlock.nspace,
                    uid: this.uid,
                    content: Contents.create(content),
                    created: now,
                    updated: now,
                    items,
                    links: []
                };

            }

            const storeSnapshot = this.createSnapshot();

            const currentBlock = this.getBlock(id)!;
            const split = currentBlock.content.type === 'markdown' ? opts.split : undefined;
            // const split = opts.split;
            const newBlockInheritItems = split?.suffix !== undefined && split?.suffix !== '';

            const restore = {
                block: currentBlock.toJSON(),
            }

            const newBlockPosition = computeNewBlockPosition();

            const {parentBlock} = newBlockPosition;

            const newBlock = createNewBlock(parentBlock);

            this.doPut([newBlock]);

            switch (newBlockPosition.type) {

                case "relative":
                    parentBlock.addItem(newBlock.id, newBlockPosition);
                    break;
                case "first-child":
                    parentBlock.addItem(newBlock.id, 'first-child');
                    break;

            }

            if (split?.suffix !== undefined && newBlock.items.length > 0) {
                this.expand(newBlock.id);
            }

            if (split?.prefix !== undefined) {

                currentBlock.setContent({
                    type: 'markdown',
                    data: split.prefix
                });

                if (newBlockInheritItems) {
                    currentBlock.setItems([]);
                }

            }

            this.setActiveWithPosition(newBlock.id, 'start');

            return {
                id: newBlock.id,
                parent: newBlock.parent!
            };

        }

        const undo = () => {

            this.doDelete([newBlockID])

            const block = this.getBlock(id);

            if (block && restoreBlock) {
                block.set(restoreBlock);
            }

        }

        return this.undoQueue.push({redo, undo}).value;

    }

    private cursorOffsetCapture(): IActiveBlock | undefined {

        const captureOffset = (): 'end' | number | undefined => {

            if (this.active !== undefined) {

                function firstRange(): Range | undefined {

                    const sel = document.getSelection();

                    if (! sel) {
                        return undefined;
                    }

                    if (sel.rangeCount === 0) {
                        return undefined;
                    }

                    return sel.getRangeAt(0);

                }

                const range = firstRange();

                if (range) {
                    const contenteditable = CursorPositions.computeContentEditableRoot(range.startContainer);
                    return CursorPositions.computeCurrentOffset(contenteditable);
                } else {
                    return 0;
                }

            }

            return undefined;

        }

        if (this.active) {
            const id = this.active.id;
            const pos = captureOffset();

            return {
                id,
                pos,
                nonce: ActiveBlockNonces.create()
            };

        } else {
            return undefined;
        }


    }

    @action private cursorOffsetRestore(active: IActiveBlock | undefined) {

        if (active?.id) {

            this._active = {
                ...active
            }

        }

    }

    /**
     * A block is only indentable if it has a parent and we are not the first
     * child in that parent. IE it must have a previous sibling so that we can
     * be
     */
    public isIndentable(id: BlockIDStr): boolean {

        const block = this.getBlock(id);

        if (! block) {
            return false;
        }

        if (! block.parent) {
            return false;
        }

        const parentBlock = this.getBlock(block.parent);

        if (! parentBlock) {
            // this is a bug and shouldn't happen
            return false;
        }

        return parentBlock.items.indexOf(id) !== 0;

    }

    private computeSelectedIndentableBlockIDs(): ReadonlyArray<BlockIDStr> {

        const selectedRoots = this.computeSelectedRoots();

        return selectedRoots
                   .filter(current => this.isIndentable(current.id))
                   .map(current => current.id);

    }

    /**
     * Make the active block a child of the prev sibling.
     *
     * @return The new parent BlockID or the code as to why it couldn't be re-parented.
     */
    public indentBlock(id: BlockIDStr): ReadonlyArray<DoIndentResult> {

        const doExec = (id: BlockIDStr): DoIndentResult => {

            console.log("doIndent: " + id);

            const block = this._index[id];

            if (! block) {
                return {error: 'no-block'};
            }

            if (! block.parent) {
                return {error: 'no-parent'};
            }

            const parentBlock = this._index[block.parent];

            if (! parentBlock) {
                console.warn("No parent block for id: " + block.parent);
                return {error: 'no-parent-block'};
            }

            const parentItems = (parentBlock.items || []);

            // figure out the sibling index in the parent
            const siblingIndex = parentItems.indexOf(id);

            if (siblingIndex > 0) {

                const newParentID = parentItems[siblingIndex - 1];

                const newParentBlock = this._index[newParentID];

                // *** remove myself from my parent

                parentBlock.removeItem(id);

                // ***: add myself to my newParent

                newParentBlock.addItem(id);

                block.setParent(newParentBlock.id);
                this.expand(newParentID);

                return {value: newParentBlock.id};

            } else {
                return {error: 'no-sibling'};
            }

        }

        const cursorOffset = this.cursorOffsetCapture();

        try {

            if (this.hasSelected()) {
                return this.computeSelectedIndentableBlockIDs().map(id => doExec(id));
            } else {
                return [doExec(id)];
            }

        } finally {
            this.cursorOffsetRestore(cursorOffset);
        }

    }

    public isUnIndentable(id: BlockIDStr) {

        if (id === this.root) {
            return false;
        }

        const block = this.getBlock(id);

        if (! block) {
            return false;
        }

        if (! block.parent) {
            // this is the root...
            return false;
        }

        if (block.parent === this.root) {
            return false;
        }

        return true;

    }

    private computeSelectedUnIndentableBlockIDs(): ReadonlyArray<BlockIDStr> {

        const selectedRoots = this.computeSelectedRoots();
        return selectedRoots.filter(current => this.isUnIndentable(current.id))
                            .map(current => current.id);

    }

    public unIndentBlock(id: BlockIDStr): ReadonlyArray<DoUnIndentResult> {

        const doExec = (id: BlockIDStr): DoUnIndentResult => {

            console.log("doUnIndent: " + id);

            const block = this._index[id];

            if (! block) {
                return {error: 'no-block'};
            }

            if (! block.parent) {
                return {error: 'no-parent'};
            }

            const parentBlock = this._index[block.parent];

            if (! parentBlock) {
                return {error: 'no-parent-block'};
            }

            if (! parentBlock.parent) {
                return {error: 'no-parent-block-parent'};
            }

            const newParentBlock = this._index[parentBlock.parent];

            if (! newParentBlock) {
                return {error: 'no-parent-block-parent-block'};
            }

            block.setParent(newParentBlock.id);
            newParentBlock.addItem(id, {pos: 'after', ref: parentBlock.id});
            parentBlock.removeItem(id);

            return {value: id};

        };

        const cursorOffset = this.cursorOffsetCapture();

        try {

            if (this.hasSelected()) {
                return this.computeSelectedUnIndentableBlockIDs().map(id => doExec(id));
            } else {
                return [doExec(id)];
            }

        } finally {
            this.cursorOffsetRestore(cursorOffset);
        }

    }

    public blockIsEmpty(id: BlockIDStr): boolean {

        const block = this._index[id];

        if (BlockPredicates.isTextBlock(block)) {
            return block?.content.data.trim() === '';
        }

        return false;

    }

    @action public doDelete(blockIDs: ReadonlyArray<BlockIDStr>) {

        interface NextActive {
            readonly active: BlockIDStr;
            readonly activePos: NavPosition;
        }

        const computeNextActive = (): NextActive | undefined => {

            const blockID = blocksToDelete[0];
            const block = this._index[blockID];

            if (! block) {
                console.log("No block for ID: " + blockID)
                return undefined;
            }

            if (! block.parent) {
                console.log("No parent for ID: " + blockID)
                return undefined;
            }

            const linearExpansionTree = this.computeLinearExpansionTree(block.parent);

            const deleteIndexes = arrayStream(blocksToDelete)
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

                    handleDelete(block.items);

                    // *** delete the id for this block from the parents items.

                    if (block.parent) {

                        const parentBlock = this._index[block.parent];

                        if (! parentBlock) {
                            console.warn(`handleDelete: Block ${block.id} (${blockID}) has no parent for ID ${block.parent}`);
                            continue;
                        }

                        parentBlock.removeItem(block.id);

                    }

                    // we have to capture this before we delete the node
                    // and keep a snapshot of it
                    const inboundIDs = [...this.reverse.get(block.id)];

                    // *** delete the block from the index
                    delete this._index[block.id];

                    // *** delete the block from name index by name.
                    if (block.content.type === 'name') {
                        delete this._indexByName[block.content.data];
                    }

                    // *** delete the reverse index for this item

                    for (const inboundID of inboundIDs) {
                        this.reverse.remove(block.id, inboundID);
                    }

                    this.collapse(blockID);

                    ++deleted;

                }

            }

            return deleted;

        };

        const selected = this.selectedIDs();

        const blocksToDelete = selected.length > 0 ? selected : blockIDs;

        if (blocksToDelete.length === 0) {
            return;
        }

        const nextActive = computeNextActive();

        if (handleDelete(blocksToDelete) > 0) {

            if (nextActive) {
                this.setActiveWithPosition(nextActive.active, nextActive.activePos);
            }

            // we have to clear now because the blocks we deleted might have been selected
            this.clearSelected('doDelete');

        }

    }

    /**
     * Compute the path to a block from its parent but not including the actual block.
     */
    public pathToBlock(id: BlockIDStr): ReadonlyArray<Block> {

        let current = this._index[id];

        const result = [];

        while (current.parent) {
            const parentBlock = this._index[current.parent];
            result.push(parentBlock);
            current = parentBlock;
        }

        return result.reverse();

    }

    public requiredAutoUnIndent(id: BlockIDStr): boolean {

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

        if (! parentBlock) {
            return false;
        }

        if (this.root === parentBlock.id) {
            return false;
        }

        return parentBlock.items.indexOf(id) === parentBlock.items.length - 1;

    }

    private withUndo<T>(action: () => T) {

        const before = this.createSnapshot();

        const result = action();

        const after = this.createSnapshot();

        // const doAsync = async () => {
        //     await this.undoQueue.push(async () => this.restoreSnapshot(before));
        // }

        if (! deepEqual(before, after)) {

            // doAsync()
            //     .catch(err => console.error(err));

        }

        return result;

    }

    // TODO: this is wrong because we're restoring too much stuff.  ALSO, since
    // it isn't updated with snapshots we're not going to properly update the data
    // once we undo it...
    private createSnapshot(): IBlocksStoreSnapshot {
        return {
            _active: Dictionaries.deepCopy(this._active),
            _dropSource: Dictionaries.deepCopy(this._dropSource),
            _dropTarget: Dictionaries.deepCopy(this._dropTarget),
            _expanded: Dictionaries.deepCopy(this._expanded),
            _index: Dictionaries.deepCopy(this._index),
            _indexByName: Dictionaries.deepCopy(this._indexByName),
            _reverse: Dictionaries.deepCopy(this._reverse),
            _selected: Dictionaries.deepCopy(this._selected),
            _selectedAnchor: Dictionaries.deepCopy(this._selectedAnchor),
            root: Dictionaries.deepCopy(this.root)
        }
    }

    private restoreSnapshot(snapshot: IBlocksStoreSnapshot) {

        this._active = snapshot._active;
        this._dropSource = snapshot._dropSource;
        this._dropTarget = snapshot._dropTarget;
        this._expanded = snapshot._expanded;
        this._index = snapshot._index;
        this._indexByName = snapshot._indexByName;
        this._reverse = snapshot._reverse;
        this._selected = snapshot._selected;
        this._selectedAnchor = snapshot._selectedAnchor;
        this.root = snapshot.root;

    }

    public async undo() {
        // await this.undoQueue.undo();
    }

    public async redo() {
        // await this.undoQueue.redo();
    }

}

export const [BlocksStoreProvider, useBlocksStoreDelegate] = createReactiveStore(() => {
    const {uid} = useBlocksStoreContext();
    const undoQueue = useUndoQueue();
    return new BlocksStore(uid, undoQueue);
})

export function useBlocksStore(): IBlocksStore {
    const delegate = useBlocksStoreDelegate();
    // return new TracingBlocksStore(delegate);
    return delegate;
}
