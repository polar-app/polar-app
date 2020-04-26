import {RepoDocInfo} from "../RepoDocInfo";
import {
    DocRepoTableColumns,
    DocRepoTableColumnsMap
} from "./DocRepoTableColumns";
import React from "react";
import {IDMaps} from "polar-shared/src/util/IDMaps";
import {Sorting} from "../../../../web/spectron0/material-ui/doc_repo_table/Sorting";
import {Provider} from "polar-shared/src/util/Providers";
import { Tag } from "polar-shared/src/tags/Tags";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface DocRepoStore {

    readonly tagsProvider: Provider<ReadonlyArray<Tag>>;

    readonly data: ReadonlyArray<RepoDocInfo>;

    readonly view: ReadonlyArray<RepoDocInfo>;

    readonly columns: DocRepoTableColumnsMap;

    readonly selected: ReadonlyArray<number>;

    readonly order: Sorting.Order,

    readonly orderBy: keyof RepoDocInfo;

    readonly page: number;

    readonly dense: boolean;

    readonly rowsPerPage: number;

}

export function useDocRepoStore() {
    return React.useContext(DocRepoStoreContext);
}

const initialState: DocRepoStore = {
    tagsProvider: () => [],
    data: [],
    view: [],
    selected: [],

    // FIXME: I think some of these are more the view configuration and
    // should probably be sorted outside the main repo
    columns: IDMaps.create(Object.values(new DocRepoTableColumns())),

    orderBy: 'progress',
    order: 'desc',
    page: 0,
    dense: true,
    rowsPerPage: 24
}

export const DocRepoStoreContext = React.createContext<DocRepoStore>(initialState)
