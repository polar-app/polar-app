import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import React, {useEffect, useState} from "react";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {Provider} from "polar-shared/src/util/Providers";
import {Tag} from "polar-shared/src/tags/Tags";
import {RepoDocMetaLoader} from "../RepoDocMetaLoader";
import {RepoDocMetaManager} from "../RepoDocMetaManager";
import {DocRepoFilters2} from "./DocRepoFilters2";
import {Preconditions} from "polar-shared/src/Preconditions";
import {Debouncers} from "polar-shared/src/util/Debouncers";
import {SelectRowType} from "./DocRepoScreen";
import { Numbers } from "polar-shared/src/util/Numbers";
import { Arrays } from "polar-shared/src/util/Arrays";
import { SetArrays } from "polar-shared/src/util/SetArrays";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IDocRepoState {

    readonly tagsProvider: Provider<ReadonlyArray<Tag>>;

    readonly data: ReadonlyArray<RepoDocInfo>;

    /**
     * The sorted view of the data based on the order and orderBy.
     */
    readonly view: ReadonlyArray<RepoDocInfo>;

    /**
     * The page data based on a slice of view, and the page number.
     */
    readonly viewPage: ReadonlyArray<RepoDocInfo>;

    /**
     * The columns the user wants to view.
     */
    readonly columns: DocRepoTableColumnsMap;

    /**
     * The selected records as pointers in to viewPage
     */
    readonly selected: ReadonlyArray<number>;

    /**
     * The sorting order.
     */
    readonly order: Sorting.Order,

    /**
     * The column we are sorting by.
     */
    readonly orderBy: keyof RepoDocInfo;

    /**
     * The page number we're viewing
     */
    readonly page: number;

    /**
     * The rows per page we have.
     */
    readonly rowsPerPage: number;

    readonly filters: DocRepoFilters2.Filters;

    // readonly setFilters: (filters: DocRepoFilters2.Filters) => {
    //
    // }

}

export interface IDocRepoStore extends IDocRepoState {

    readonly selectedProvider: Provider<ReadonlyArray<number>>;

    readonly selectRow: (selectedIdx: number,
                         event: React.MouseEvent,
                         type: SelectRowType) => void;

}

export function useDocRepoStore() {
    return React.useContext(DocRepoStoreContext);
}

const initialStore: IDocRepoStore = {
    data: [],
    view: [],
    viewPage: [],
    selected: [],

    // FIXME this is actually another component and shouldn't be here I think..

    // FIXME: I think some of these are more the view configuration and
    // should probably be sorted outside the main repo
    columns: IDMaps.create(Object.values(new DocRepoTableColumns())),

    orderBy: 'progress',
    order: 'desc',
    page: 0,
    rowsPerPage: 24,

    filters: {},
    selectedProvider: () => [],
    tagsProvider: () => [],
    selectRow: NULL_FUNCTION
}

export const DocRepoStoreContext = React.createContext<IDocRepoStore>(initialStore)

function useComponentDidMount<T>(delegate: () => void) {
    // https://dev.to/trentyang/replace-lifecycle-with-hooks-in-react-3d4n
    useEffect(() => delegate(), []);
}

function useComponentWillUnmount(delegate: () => void) {
    useEffect(() => delegate, []);
}

interface IProps {
    readonly repoDocMetaLoader: RepoDocMetaLoader;
    readonly repoDocMetaManager: RepoDocMetaManager;

    readonly children: React.ReactNode;
}

/**
 * Apply a reducer a temporary state, to compute the effective state.
 */
function reduce(tmpState: IDocRepoState): IDocRepoState {

    // compute the view, then the viewPage

    const {data, page, rowsPerPage, order, orderBy, filters} = tmpState;

    // Now that we have new data, we have to also apply the filters and sort
    // order to the results, then update the view + viewPage

    const dataFiltered = DocRepoFilters2.execute(data, filters);
    const view = Sorting.stableSort(dataFiltered, Sorting.getComparator(order, orderBy));
    const viewPage = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return {...tmpState, view, viewPage};

}

// function createInitialState() {
//
//     const state = {
//         ...initialState
//     };
//
//     return {
//         ...state,
//     }
//
// }

export const DocRepoStoreProvider = (props: IProps) => {

    // FIXME: what functions do I need

    // delete(repoDocInfos: ReadonlyArray<RepoDocInfo>)
    //

    // FIXME: how can we have the state update itself?.... createInitialState function??

    const {repoDocMetaLoader, repoDocMetaManager} = props;
    const [state, setState] = useState<IDocRepoState>({...initialStore});

    const doUpdate = () => {
        setTimeout(() => {
            const data = repoDocMetaManager.repoDocInfoIndex.values();
            setState(reduce({...state, data}));
        }, 1)
    }

    // the debouncer here is VERY important... otherwise we lock up completely
    const eventListener = Debouncers.create(() => {
        // FIXME: we seem to get aLL the docs all at once even though
        // I'm getting the callbacks properly..
        doUpdate();
    });

    useComponentDidMount(() => {
        doUpdate();
        repoDocMetaLoader.addEventListener(eventListener)
    });

    useComponentWillUnmount(() => {
        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(eventListener),
                                      "Failed to remove event listener");
    });

    // callback implementations...
    const selectedProvider = () => state.selected;

    const selectRow = (selectedIdx: number,
                       event: React.MouseEvent,
                       type: SelectRowType) => {

        const selected = Callbacks.selectRow(selectedIdx, event, type);

        setState({
            ...state,
            selected: selected || []
        });
    }

    const store: IDocRepoStore = {
        ...state,
        selectedProvider,
        selectRow
    };

    return (
        <DocRepoStoreContext.Provider value={store}>
            {props.children}
        </DocRepoStoreContext.Provider>
    );

}


// FIXME: move this outside...
namespace Callbacks {

    export function selectRow(selectedIdx: number,
                              event: React.MouseEvent,
                              type: SelectRowType) {

        selectedIdx = Numbers.toNumber(selectedIdx);

        // there are really only three strategies
        //
        // - one: select ONE item and unselect the previous item(s).  This is done when we have
        //        a single click on an item.  It always selects it and never de-selects it.
        //
        // - add the new selectedIndex to the list of currently selected items.
        //
        //   - FIXME: really what this is is just select-one but we leave the
        //     previous items in place and perform no mutation on them...

        // - toggle: used when the type is 'checkbox' because we're only toggling
        //   the selection of that one item
        //
        // - none: do nothing.  this is used when the context menu is being used and no additional
        //         items are being changed.

        type SelectionStrategy = 'one' | 'range' | 'toggle' | 'none';

        type SelectedRows = ReadonlyArray<number>;

        const computeStrategy = (): SelectionStrategy => {

            if (type === 'checkbox') {
                return 'toggle';
            }

            if (type === 'click') {

                if (event.getModifierState("Shift")) {
                    return 'range';
                }

                if (event.getModifierState("Control") || event.getModifierState("Meta")) {
                    return 'toggle';
                }

            }

            if (type === 'context') {

                if (this.state.selected.includes(selectedIdx)) {
                    return 'none';
                }

            }

            return 'one';

        };

        const doStrategyRange = (): SelectedRows => {

            // select a range

            let min: number = 0;
            let max: number = 0;

            if (this.state.selected.length > 0) {
                const sorted = [...this.state.selected].sort((a, b) => a - b);
                min = Arrays.first(sorted)!;
                max = Arrays.last(sorted)!;
            }

            const selected = [...Numbers.range(Math.min(min, selectedIdx),
                Math.max(max, selectedIdx))];

            return selected;

        };

        const doStrategyToggle = (): SelectedRows => {
            const selected = [...this.state.selected];

            if (selected.includes(selectedIdx)) {
                return SetArrays.difference(selected, [selectedIdx]);
            } else {
                return SetArrays.union(selected, [selectedIdx]);
            }

        };

        const doStrategyOne = (): SelectedRows => {
            return [selectedIdx];
        };

        const doStrategy = (): SelectedRows | undefined => {

            const strategy = computeStrategy();

            switch (strategy) {
                case "one":
                    return doStrategyOne();
                case "range":
                    return doStrategyRange();
                case "toggle":
                    return doStrategyToggle();
                case "none":
                    return undefined;
            }

        };

        return doStrategy();

    }
}
