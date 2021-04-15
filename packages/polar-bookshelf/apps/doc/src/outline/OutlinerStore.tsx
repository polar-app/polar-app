import * as React from 'react';
import {
    createObservableStore,
    SetStore
} from "../../../../web/js/react/store/ObservableStore";
import {Provider} from "polar-shared/src/util/Providers";
import {FolderSelectionEvents} from "../../../repository/js/folder_sidebar/FolderSelectionEvents";
import Selected = FolderSelectionEvents.Selected;
import SelfSelected = FolderSelectionEvents.SelfSelected;
import {IDStr} from "polar-shared/src/util/Strings";

interface IOutlinerStore {

    /**
     * The state of selected nodes.
     */
    readonly selected: ReadonlyArray<IDStr>;

    /**
     * The state of expanded nodes.
     */
    readonly expanded: ReadonlyArray<IDStr>;

}

interface IOutlinerCallbacks {

    readonly selectRow: (node: IDStr, event: React.MouseEvent, source: 'checkbox' | 'click') => void;

    readonly toggleExpanded: (nodes: ReadonlyArray<IDStr>) => void;

    readonly collapseNode: (node: IDStr) => void;

    readonly expandNode: (node: IDStr) => void;

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

        function selectRow(node: IDStr,
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

        function toggleExpanded(nodes: ReadonlyArray<IDStr>): void {

            const store = storeProvider();

            const expanded = [...store.expanded];

            for (const node of nodes) {

                const index = expanded.indexOf(node);

                if (expanded.includes(node)) {
                    expanded.splice(index, 1);
                } else {
                    expanded.push(node);
                }

            }

            setStore({...store, expanded});

        }

        function collapseNode(node: IDStr) {

            const store = storeProvider();

            const expanded = [...store.expanded]
                .filter(current => current !== node);

            setStore({...store, expanded});

        }

        function expandNode(node: IDStr) {

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
        callbacksFactory: useCallbacksFactory,
        enableShallowEquals: true
    });

