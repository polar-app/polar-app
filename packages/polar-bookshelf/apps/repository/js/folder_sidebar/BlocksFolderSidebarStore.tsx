import {action, comparer, computed, makeObservable, observable, reaction} from "mobx";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import React from "react";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {IBlocksStore} from "../../../../web/js/notes/store/IBlocksStore";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {TagDescriptorSelected} from "./FolderSidebarStore";
import {useUserTagsDB} from "../persistence_layer/UserTagsDataLoader";
import {useBlocksAnnotationRepoStore} from "../block_annotation_repo/BlocksAnnotationRepoStore";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";
import {IBlockPredicates} from "../../../../web/js/notes/store/IBlockPredicates";
import {useDocRepoCallbacks} from "../doc_repo/DocRepoStore2";
import {TagNodes} from "../../../../web/js/tags/TagNodes";
import {BlockPredicates} from "../../../../web/js/notes/store/BlockPredicates";
import {useUpdateBlockTags} from "../../../../web/js/notes/NoteUtils";
import {BlockTextContentUtils} from "../../../../web/js/notes/BlockTextContentUtils";

type IMemberPredicate = (block: IBlock) => boolean;

class BlocksFolderSidebarStore {

    private readonly _blocksStore: IBlocksStore;
    private readonly _memberPredicate: IMemberPredicate;

    /* eslint-disable functional/prefer-readonly-type */
    @observable private _filter: string = "";
    @observable private _tags: ReadonlyArray<Tag> = [];
    @observable private _selected: Set<Tags.TagID> = new Set();
    @observable private _expanded: Set<Tags.TagID> = new Set();
    /* eslint-enable functional/prefer-readonly-type */

    constructor(blocksStore: IBlocksStore, memberPredicate: IMemberPredicate) {
        this._blocksStore = blocksStore;
        this._memberPredicate = memberPredicate;

        makeObservable(this);
    }

    @computed({ equals: comparer.structural }) get tags(): ReadonlyArray<TagDescriptor> {
        const getLabel = (id: BlockIDStr): string | undefined => {
            const block = this._blocksStore.getBlock(id);

            if (! block || ! BlockPredicates.isNamedBlock(block)) {
                return undefined;
            }

            return BlockTextContentUtils.getTextContentMarkdown(block.content);
        };

        const toTagDescriptor = (tag: Tag): TagDescriptor => {

            const memberIDs = this._blocksStore.tagsIndex.get(tag.id);
            const members = this._blocksStore
                .idsToBlocks(memberIDs)
                .filter(this._memberPredicate)
                .map(({ id }) => id);

            return {
                ...tag,
                label: getLabel(tag.id) || tag.label,
                members,
                count: members.length,
            };
        };

        return this._tags
            .map(toTagDescriptor)
            .sort((a, b) => b.count - a.count);

    }

    @computed({ equals: comparer.structural }) get foldersRoot() {
        const toTagDescriptorSelected = (tag: TagDescriptor): TagDescriptorSelected => ({
            ...tag,
            selected: this._selected.has(tag.id),
        });

        const rawFoldersRoot = TagNodes.createFoldersRoot({
            tags: this.computeFiltered(this.tags),
            type: "folder",
        });

        return TagNodes.decorate(rawFoldersRoot, toTagDescriptorSelected);
    }

    @computed({ equals: comparer.structural }) get tagsView() {
        return Tags.onlyRegular(this.computeFiltered(this.tags));
    }

    get filter() {
        return this._filter;
    }

    @computed get selected() {
        return [...this._selected.values()];
    }

    @computed get expanded() {
        return [...this._expanded.values()];
    }

    @computed get selectedTags() {
        return this._tags.filter(({ id }) => this._selected.has(id));
    }

    @action setTags(tags: ReadonlyArray<Tag>) {
        this._tags = tags;
    }

    @action selectRow(node: Tags.TagID,
                      event: React.MouseEvent,
                      type: SelectRowType): void {


        const folderRoot = this.foldersRoot ? [this.foldersRoot.value] : [];

        const selected = SelectionEvents2.selectRow(node,
                                                    Array.from(this._selected),
                                                    [...this._tags, ...folderRoot],
                                                    event,
                                                    type);

        this._selected = new Set(selected);
    }

    @action collapseNode(node: Tags.TagID): void {
        this._expanded.delete(node);
    }

    @action expandNode(node: Tags.TagID): void {
        this._expanded.add(node);
    }

    @action setFilter(filter: string): void {
        this._filter = filter;
        this._selected.clear();
    }

    private computeFiltered(tags: ReadonlyArray<TagDescriptor>) {

        const filterPredicate = (tag: TagDescriptor) =>
            tag.label.toLowerCase().indexOf(this._filter) !== -1;

        if (this._filter.trim() !== '') {
            return tags.filter(filterPredicate);
        }

        return tags;

    }
}

interface IUseNewBlocksFolderSidebarStoreOpts {
    readonly onSelectedTagsChange: (tags: ReadonlyArray<Tag>) => void;
    readonly memberPredicate: IMemberPredicate;
}

const useNewBlocksFolderSidebarStore = (opts: IUseNewBlocksFolderSidebarStoreOpts) => {
    const { onSelectedTagsChange, memberPredicate } = opts;
    const blocksStore = useBlocksStore();
    const userTagsDB = useUserTagsDB();

    const store = React.useMemo(() =>
        new BlocksFolderSidebarStore(blocksStore, memberPredicate), [blocksStore, memberPredicate]);

    React.useEffect(() => store.setTags(userTagsDB.tags()), [userTagsDB, store]);

    React.useEffect(() => {
        const getSelectedTags = () => store.selectedTags;

        onSelectedTagsChange(getSelectedTags());
        return reaction(getSelectedTags, onSelectedTagsChange);
    }, [store, onSelectedTagsChange]);

    return store;
};

type IBlocksFolderSidebarStoreContext = {
    readonly store: BlocksFolderSidebarStore;
    readonly dropHandler: (tagID: BlockIDStr) => void;
};

const BlocksFolderSidebarStoreContext = React.createContext<IBlocksFolderSidebarStoreContext | null>(null);

export const DocRepoBlocksFolderSidebarStoreProvider: React.FC = ({ children }) => {
    const { onTagSelected, onDropped } = useDocRepoCallbacks();

    const onSelectedTagsChange = React.useCallback((tags: ReadonlyArray<Tag>) => {
        const oldFormatTags = tags.map(({ label }) => ({ id: label, label }));
        onTagSelected(oldFormatTags);
    }, [onTagSelected]);

    const store = useNewBlocksFolderSidebarStore({
        onSelectedTagsChange,
        memberPredicate: IBlockPredicates.isDocumentBlock,
    });

    const dropHandler = React.useCallback((tagID: BlockIDStr) => {
        const [target] = Tags.lookupByTagLiteral(store.tags, [tagID]);

        if (! target) {
            return;
        }


        onDropped(target);
    }, [store, onDropped]);

    const value = React.useMemo(() => ({ store, dropHandler }), [store, dropHandler]);

    return <BlocksFolderSidebarStoreContext.Provider children={children} value={value} />;
};

export const AnnotationRepoBlocksFolderSidebarStoreProvider: React.FC = ({ children }) => {
    const annotationRepoStore = useBlocksAnnotationRepoStore();
    const updateBlockTags = useUpdateBlockTags();

    const onSelectedTagsChange = React.useCallback((tags: ReadonlyArray<Tag>) =>
        annotationRepoStore.setFilter({ tags }), [annotationRepoStore]);

    const blocksStore = useBlocksStore();

    const memberPredicate = React.useCallback((block: IBlock): boolean => {

        if (IBlockPredicates.isAnnotationHighlightBlock(block)) {
            return true;
        }

        if (! block.parent) {
            return false;
        }

        const parentBlock = blocksStore.getBlock(block.parent);

        if (parentBlock && parentBlock) {
            return IBlockPredicates.isAnnotationHighlightBlock(parentBlock);
        }

        return false;
    }, [blocksStore]);

    const store = useNewBlocksFolderSidebarStore({
        onSelectedTagsChange,
        memberPredicate,
    });

    const dropHandler = React.useCallback((tagID: BlockIDStr) => {
        const [tag] = Tags.lookupByTagLiteral(store.tags, [tagID]);

        if (! tag) {
            return;
        }


        const targets = blocksStore.idsToBlocks(annotationRepoStore.selected);

        updateBlockTags(targets, [tag], 'add');

    }, [store, annotationRepoStore, blocksStore, updateBlockTags]);

    const value = React.useMemo(() => ({ store, dropHandler }), [store, dropHandler]);

    return <BlocksFolderSidebarStoreContext.Provider children={children} value={value} />;
};

export const useBlocksFolderSidebarContext = () => {
    const value = React.useContext(BlocksFolderSidebarStoreContext);

    if (! value) {
        throw new Error('useBlocksFolderSidebarStore must be used in a component that\'s wrapped within BlocksFolderSidebarStoreProvider');
    }

    return value;
};

export const useBlocksFolderSidebarStore = () => {
    return useBlocksFolderSidebarContext().store;
};

export const useBlocksFolderSidebarDropHandler = () => {
    return useBlocksFolderSidebarContext().dropHandler;
};
