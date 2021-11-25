import {action, observable} from "mobx";
import {INotesRepoRow} from "./NotesRepoTable2";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import * as React from "react";

export type Order = 'asc' | 'desc';

export class NotesRepoStore {

    @observable order: Order = 'asc';

    @observable orderBy: keyof INotesRepoRow = 'title';

    @action public setOrderBy(orderBy: keyof INotesRepoRow, order: Order) {
        this.orderBy = orderBy;
        this.order = order;
    }

}


export const [NotesRepoStoreProvider, useNotesRepoStoreDelegate] = createStoreContext(() => {
    return React.useMemo(() => new NotesRepoStore(), []);
})

export function useNotesRepoStore() {
    return useNotesRepoStoreDelegate();
}
