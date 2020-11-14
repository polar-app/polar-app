import * as React from 'react';
import {Tags} from "polar-shared/src/tags/Tags";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import TagID = Tags.TagID;
import {FolderSelectionEvents} from "../../../repository/js/folder_sidebar/FolderSelectionEvents";
import Selected = FolderSelectionEvents.Selected;
import SelfSelected = FolderSelectionEvents.SelfSelected;

export interface TagDescriptorSelected extends TagDescriptor {
    readonly selected: boolean
}

interface IOutlinerStore {

    /**
     * The state of selected nodes.
     */
    readonly selected: ReadonlyArray<TagID>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: ReadonlyArray<TagID>;

}

interface IOutlinerCallbacks {

    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void;

    readonly toggleExpanded: (nodes: ReadonlyArray<TagID>) => void;

    readonly collapseNode: (node: TagID) => void;

    readonly expandNode: (node: TagID) => void;

}

const initialStore: IOutlinerStore = {
    selected: [],
    expanded: []
}

interface Mutation {
}

interface Mutator {

}

function mutatorFactory(storeProvider: Provider<IOutlinerStore>,
                        setStore: SetStore<IOutlinerStore>): Mutator {

    return {};

}

function useCallbacksFactory(storeProvider: Provider<IOutlinerStore>,
                             setStore: (store: IOutlinerStore) => void,
                             mutator: Mutator): IOutlinerCallbacks {

    return React.useMemo(() => {

        function selectRow(node: TagID,
                           event: React.MouseEvent,
                           source: 'checkbox' | 'click'): void {

            const store = storeProvider();

            function toSelected(): Selected {

                if (store.selected.length > 1) {
                    return 'multiple';
                } else if (store.selected.length === 1) {
                    return 'single';
                } else {
                    return 'none';
                }

            }

            function toSelfSelected(): SelfSelected {
                return store.selected.includes(node) ? 'yes' : 'no';
            }

            const eventType = FolderSelectionEvents.toEventType(event, source);
            const selected = toSelected();
            const selfSelected = toSelfSelected();

            const strategy = FolderSelectionEvents.toStrategy({eventType, selected, selfSelected});

            const newSelected = FolderSelectionEvents.executeStrategy(strategy, node, store.selected);

            setStore({...store, selected: newSelected});

        }

        function toggleExpanded(nodes: ReadonlyArray<TagID>): void {

            const store = storeProvider();

            setStore({
                ...store,
                expanded: nodes
            });

        }

        function collapseNode(node: TagID) {

            const store = storeProvider();

            const expanded = [...store.expanded]
                .filter(current => current !== node);

            setStore({...store, expanded});

        }

        function expandNode(node: TagID) {

            const store = storeProvider();

            const expanded = [...store.expanded];

            if (! expanded.includes(node)) {
                expanded.push(node);
            }

            setStore({...store, expanded});

        }

        return {
            toggleExpanded,
            collapseNode,
            expandNode,
            selectRow
        };

    }, [storeProvider, setStore]);


}

export const [OutlinerStoreProviderDelegate, useOutlinerStore, useOutlinerCallbacks, useOutlinerMutator] =
    createObservableStore<IOutlinerStore, Mutator, IOutlinerCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory: useCallbacksFactory
    });

