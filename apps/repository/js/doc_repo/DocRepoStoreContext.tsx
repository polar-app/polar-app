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

interface DocRepoStore {

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

}

export function useDocRepoStore() {
    return React.useContext(DocRepoStoreContext);
}

const initialState: DocRepoStore = {
    tagsProvider: () => [],
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

    filters: {}
}

export const DocRepoStoreContext = React.createContext<DocRepoStore>(initialState)

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
function reduce(tmpState: DocRepoStore) {

    // compute the view, then the viewPage

    const {data, page, rowsPerPage, order, orderBy, filters} = tmpState;

    // Now that we have new data, we have to also apply the filters and sort
    // order to the results, then update the view + viewPage

    const dataFiltered = DocRepoFilters2.execute(data, filters);
    const view = Sorting.stableSort(dataFiltered, Sorting.getComparator(order, orderBy));
    const pageData = view.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return {...tmpState, view, pageData};

}

export const DocRepoStore = (props: IProps) => {

    const {repoDocMetaLoader, repoDocMetaManager} = props;
    const [state, setState] = useState<DocRepoStore>({...initialState});

    const doUpdate = () => {
        setTimeout(() => {
            const data = repoDocMetaManager.repoDocInfoIndex.values();
            setState(reduce({...state, data}));
        }, 1)
    }

    const eventListener = () => {

        // FIXME: use a debouncer here...
        // FIXME: we seem to get aLL the docs all at once even though
        // I'm getting the callbacks properly..
        doUpdate();

    };

    useComponentDidMount(() => {
        doUpdate();
        repoDocMetaLoader.addEventListener(eventListener)
    });

    useComponentWillUnmount(() => {
        Preconditions.assertCondition(repoDocMetaLoader.removeEventListener(eventListener),
                                      "Failed to remove event listener");
    });

    return (
        <DocRepoStoreContext.Provider value={state}>
            {props.children}
        </DocRepoStoreContext.Provider>
    );

}
