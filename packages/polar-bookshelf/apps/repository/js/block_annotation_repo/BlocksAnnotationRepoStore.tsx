import {action, comparer, computed, makeObservable, observable, reaction} from "mobx";
import {
    IAnnotationContent,
    IFlashcardAnnotationContent,
    ITextHighlightAnnotationContent
} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {IBlocksStore} from "../../../../web/js/notes/store/IBlocksStore";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import {IMouseEvent} from "../doc_repo/MUIContextMenu2";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {Block} from "../../../../web/js/notes/store/Block";
import {BlocksAnnotationRepoFilters} from "./BlocksAnnotationRepoFilters";
import {ListValue} from "../../../../web/js/intersection_list/IntersectionList";
import {AnnotationContent} from "../../../../web/js/notes/content/AnnotationContent";
import {MarkdownContent} from "../../../../web/js/notes/content/MarkdownContent";
import {BlockPredicates} from "../../../../web/js/notes/store/BlockPredicates";


export type RepoAnnotationContent = AnnotationContent | MarkdownContent;
export type IRepoAnnotationContent = IAnnotationContent | IMarkdownContent;
export type IRepoAnnotationTextContent = ITextHighlightAnnotationContent
                                         | IFlashcardAnnotationContent
                                         | IMarkdownContent;

/**
 * The indicates the depth of children to be displayed in the annotation repo for each highlight block
 */
export const ANNOTATION_REPO_CHILDREN_DEPTH = 2;

export class BlocksAnnotationRepoStore {
    private readonly _blocksStore: IBlocksStore;

    @observable private _selected: Map<BlockIDStr, boolean> = new Map();
    @observable private _active: BlockIDStr | null = null;
    @observable private _filter: BlocksAnnotationRepoFilters.Filter = {};

    constructor(blocksStore: IBlocksStore) {
        this._blocksStore = blocksStore;

        makeObservable(this);
    }

    @computed get activeBlock(): Block<RepoAnnotationContent> | undefined {
        if (! this._active) {
            return undefined;
        }

        const block = this._blocksStore.getBlock(this._active);

        if (! block ||
            (! BlockPredicates.isAnnotationBlock(block)
             && ! BlockPredicates.isMarkdownBlock(block))) {

            return undefined;
        }

        return block;
    }

    @computed get annotationBlocks(): ReadonlyArray<IBlock<IRepoAnnotationContent>> {
        return this._blocksStore.idsToBlocks(this._blocksStore.annotationsIndex) as ReadonlyArray<IBlock<IRepoAnnotationContent>>;
    }

    @computed({ equals: comparer.structural }) get view(): ReadonlyArray<ListValue> {

        const blocks = this.annotationBlocks;

        return BlocksAnnotationRepoFilters
            .execute(this._blocksStore.tagsIndex, blocks, this._filter)
            .map(({ id }) => ({ id }));
    }

    get filter(): BlocksAnnotationRepoFilters.Filter {
        return this._filter;
    }

    get selected() {
        return [...this._selected.keys()];
    }

    @action setFilter(filter: Partial<BlocksAnnotationRepoFilters.Filter>): void {
        this._filter = { ...this._filter, ...filter };
    }

    @action public selectItem(id: BlockIDStr, event: IMouseEvent, type: SelectRowType): void {
        const selected = SelectionEvents2.selectRow(id,
                                                    Array.from(this._selected.keys()),
                                                    this.view,
                                                    event,
                                                    type);

        this.clearSelected();

        this._active = selected[0];

        selected.forEach(x => this._selected.set(x, true));
    }

    @action public clearSelected(): void {
        this._selected.clear();
    }

    public isSelected(id: BlockIDStr): boolean {
        return this._selected.get(id) === true;
    }

    public idsToRepoAnnotationBlocks(ids: ReadonlyArray<BlockIDStr>): ReadonlyArray<IBlock<IRepoAnnotationContent>> {
        return this._blocksStore
            .idsToBlocks(ids)
            .map(block => block as IBlock<IBlockContent>)
            .filter((block): block is IBlock<IRepoAnnotationContent> =>
                    BlocksAnnotationRepoStore.isRepoAnnotationBlock(this._blocksStore, block));
    }

    static isRepoAnnotationBlock(blocksStore: IBlocksStore, block: IBlock): block is IBlock<IRepoAnnotationContent> {
        const rootBlock = blocksStore.getBlock(block.root);

        return rootBlock !== undefined
               && IBlockPredicates.isDocumentBlock(rootBlock)
               && (IBlockPredicates.isAnnotationBlock(block) || IBlockPredicates.isMarkdownBlock(block))
               && block.parents.length <= ANNOTATION_REPO_CHILDREN_DEPTH;
    }
}

export const [BlocksAnnotationRepoStoreProvider, useBlocksAnnotationRepoStore] = createStoreContext(() => {
    const blocksStore = useBlocksStore();
    const store = React.useMemo(() => new BlocksAnnotationRepoStore(blocksStore), [blocksStore]);

    return store;
});


export const useAnnotationRepoViewBlockIDs = () => {
    const blocksAnnotationRepoStore = useBlocksAnnotationRepoStore();
    const [blockIDs, setBlockIDs] = React.useState<ReadonlyArray<ListValue>>([]);

    React.useEffect(() => {
        const getBlockAnnotationIDs = () => blocksAnnotationRepoStore.view;

        const disposer = reaction(getBlockAnnotationIDs, setBlockIDs, { equals: comparer.structural });

        setBlockIDs(getBlockAnnotationIDs());

        return disposer;
    }, [blocksAnnotationRepoStore, setBlockIDs]);

    return blockIDs;
};
