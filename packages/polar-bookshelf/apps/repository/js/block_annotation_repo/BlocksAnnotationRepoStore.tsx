import {action, computed, makeObservable, observable} from "mobx";
import {IAnnotationContent, IFlashcardAnnotationContent, ITextHighlightAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {BlockIDStr, IBlock, IBlockContent} from "polar-blocks/src/blocks/IBlock";
import React from "react";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {IBlocksStore} from "../../../../web/js/notes/store/IBlocksStore";
import {createReactiveStore} from "../../../../web/js/react/store/ReactiveStore";
import {IMouseEvent} from "../doc_repo/MUIContextMenu2";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {IMarkdownContent} from "polar-blocks/src/blocks/content/IMarkdownContent";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {Block} from "../../../../web/js/notes/store/Block";
import {BlocksAnnotationRepoFilters} from "./BlocksAnnotationRepoFilters";


export type IRepoAnnotationContent = IAnnotationContent | IMarkdownContent;
export type IRepoAnnotationTextContent = ITextHighlightAnnotationContent
                                         | IFlashcardAnnotationContent
                                         | IMarkdownContent;

export class BlocksAnnotationRepoStore {
    private readonly _blocksStore: IBlocksStore;

    @observable private _selected: Set<BlockIDStr> = new Set<BlockIDStr>();
    @observable private _active: BlockIDStr | null = null;
    @observable private _filter: BlocksAnnotationRepoFilters.Filter = {};

    constructor(blocksStore: IBlocksStore) {
        this._blocksStore = blocksStore;

        makeObservable(this);
    }

    @computed get activeBlock(): IBlock<IRepoAnnotationContent> | undefined {
        if (! this._active) {
            return undefined;
        }

        const block = this._blocksStore.getBlock(this._active);
        const blockJSON = block?.toJSON();

        if (! blockJSON || ! this.isRepoAnnotationBlock(blockJSON)) {
            return undefined;
        }

        return blockJSON;
    }

    @computed get annotationBlocks(): ReadonlyArray<IBlock<IRepoAnnotationContent>> {
        const documentBlocks = this._blocksStore
            .idsToBlocks(Object.values(this._blocksStore.indexByDocumentID));

        const getDirectChildren = (block: Block): ReadonlyArray<Block> =>
            this._blocksStore.idsToBlocks(block.itemsAsArray);

        const highlights = documentBlocks.flatMap(getDirectChildren);
        const firstLevelChildren = highlights.flatMap(getDirectChildren);

        const allChildren = [...highlights, ...firstLevelChildren];

        return allChildren
            .map(block => block.toJSON() as IBlock<IBlockContent>)
            .filter(this.isRepoAnnotationBlock.bind(this));
    }

    @computed get view(): ReadonlyArray<IBlock<IRepoAnnotationContent>> {
        return BlocksAnnotationRepoFilters.execute(this.annotationBlocks, this._filter);
    }

    get filter(): BlocksAnnotationRepoFilters.Filter {
        return this._filter;
    }

    @action setFilter(filter: Partial<BlocksAnnotationRepoFilters.Filter>): void {
        this._filter = { ...this._filter, ...filter };
    }

    @action public selectItem(id: BlockIDStr, event: IMouseEvent, type: SelectRowType): void {
        const selected = SelectionEvents2.selectRow(id,
                                                    Array.from(this._selected),
                                                    this.view,
                                                    event,
                                                    type);
        
        this.clearSelected();

        this._active = selected[0];

        selected.forEach(x => this._selected.add(x));
    }

    @action public clearSelected(): void {
        this._selected.clear();
    }

    public isSelected(id: BlockIDStr): boolean {
        return this._selected.has(id);
    }

    private isRepoAnnotationBlock(block: IBlock): block is IBlock<IRepoAnnotationContent> {
        return IBlockPredicates.isAnnotationBlock(block)
               || block.content.type === 'markdown';
    }
}

export const [BlocksAnnotationRepoStoreProvider, useBlocksAnnotationRepoStore] = createReactiveStore(() => {
    const blocksStore = useBlocksStore();
    const store = React.useMemo(() => new BlocksAnnotationRepoStore(blocksStore), [blocksStore]);

    return store;
})

