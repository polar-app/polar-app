import React from 'react';
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {TNode, TRoot} from "../../../../web/js/ui/tree/TreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {createObservableStore} from "../../../../web/spectron0/material-ui/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {useRepoDocInfos} from "../doc_repo/DocRepoHooks";
import {useTagsContext} from "../persistence_layer/PersistenceLayerApp";
import {TagNodes} from "../../../../web/js/tags/TagNodes";
import isEqual from "react-fast-compare";

export type NodeID = string;

/**
 * The primary fields from which the store is derived.
 */
interface IFolderSidebarStoreSource {

    /**
     * The filter of the current tags.
     */
    readonly filter: string;

    /**
     * The tags used to build the store. Used for rebuilding.
     */
    readonly tags: ReadonlyArray<TagDescriptor>;

}

interface IFolderSidebarStore extends IFolderSidebarStoreSource {

    readonly tagsView: ReadonlyArray<TagDescriptor>;

    readonly foldersRoot: TRoot<TagDescriptor> | undefined;

    /**
     * The state of selected nodes.
     */
    readonly selected: ReadonlyArray<NodeID>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: ReadonlyArray<NodeID>;

}

interface IFolderSidebarCallbacks {

    readonly toggleSelected: (nodes: ReadonlyArray<NodeID>) => void;
    readonly toggleExpanded: (nodes: ReadonlyArray<NodeID>) => void;

    readonly collapseNode: (node: NodeID) => void;
    readonly expandNode: (node: NodeID) => void;

    readonly setFilter: (text: string) => void;

}

const folderStore: IFolderSidebarStore = {
    filter: "",
    tags: [],
    tagsView: [],
    foldersRoot: undefined,
    selected: [],
    expanded: []
}

interface Mutator {

}

function mutatorFactory(): Mutator {
    return {};
}

function reduce(store: IFolderSidebarStore,
                source: IFolderSidebarStoreSource): IFolderSidebarStore {

    function computeFiltered(tags: ReadonlyArray<TagDescriptor>) {

        const filterPredicate = (tag: TagDescriptor) => {
            return tag.label.toLowerCase().indexOf(source.filter) !== -1
        }

        if (source.filter.trim() !== '') {
            return tags.filter(filterPredicate);
        }

        return tags;

    }

    function rebuildStore(tags: ReadonlyArray<TagDescriptor>): IFolderSidebarStore {

        const filtered = computeFiltered(tags);

        const tagsView = Tags.onlyRegular(filtered);
        const foldersRoot = TagNodes.createFoldersRoot({tags: filtered, type: 'folder'})

        return {
            ...store,
            filter: source.filter,
            tags,
            tagsView,
            foldersRoot
        }

    }

    // always sort the tags so that if they change slightly we at least have a
    // deterministic layout.
    const tags = [...source.tags].sort((a, b) => b.count - a.count)

    if (! isEqual(store.tags, tags) || store.filter.trim() !== source.filter.trim()) {
        return rebuildStore(tags);
    }

    return store

}

function callbacksFactory(storeProvider: Provider<IFolderSidebarStore>,
                          setStore: (store: IFolderSidebarStore) => void,
                          mutator: Mutator): IFolderSidebarCallbacks {


    // used so that we listen to repoDocInfos and get them for every update
    // so that we can build a new store.
    //
    // TODO: This isn't an amazingly good way to listen for updates since we're
    // just trying to get the tagsContext working..
    useRepoDocInfos();

    const tagsContext = useTagsContext();

    function doHookReduce() {
        const store = storeProvider();

        const newStore = reduce(store, {
            tags: tagsContext?.tagsProvider() || [],
            filter: store.filter
        });

        setStore(newStore);

    }

    doHookReduce();

    function toggleSelected(nodes: ReadonlyArray<NodeID>): void {

        const store = storeProvider();

        const selected = nodes;

        setStore({
            ...store,
            selected
        });
    }

    function toggleExpanded(nodes: ReadonlyArray<NodeID>): void {

        const store = storeProvider();

        // const expanded = doToggle(store.expanded, nodes);

        setStore({
            ...store,
            expanded: nodes
        });
    }

    function collapseNode(node: NodeID) {

        console.log("FIXME collapseNode: ", node);

        const store = storeProvider();

        const expanded = [...store.expanded]
            .filter(current => current !== node);

        setStore({...store, expanded});

    }

    function expandNode(node: NodeID) {

        console.log("FIXME expandNode: ", node);

        const store = storeProvider();

        const expanded = [...store.expanded];

        if (! expanded.includes(node)) {
            expanded.push(node);
        }

        setStore({...store, expanded});

    }

    function setFilter(filter: string) {

        const store = storeProvider();

        setStore(reduce(store, {...store, filter}));
    }

    return {
        toggleSelected, toggleExpanded, collapseNode, expandNode, setFilter
    };

}

export const [FolderSidebarStoreProvider, useFolderSidebarStore, useFolderSidebarCallbacks]
    = createObservableStore<IFolderSidebarStore, Mutator, IFolderSidebarCallbacks>({
    initialValue: folderStore,
    mutatorFactory,
    callbacksFactory
});

interface IProps {
    readonly children: JSX.Element;
}

export const FolderSidebarStore = (props: IProps) => {

    return (
        <FolderSidebarStoreProvider>
            {props.children}
        </FolderSidebarStoreProvider>
    )

}
