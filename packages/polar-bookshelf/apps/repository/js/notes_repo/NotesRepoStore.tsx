import {action, computed, observable} from "mobx";
import {INotesRepoRow} from "./NotesRepoTable2";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import * as React from "react";

export type Order = 'asc' | 'desc';

export class NotesRepoStore {

    @observable _order: Order = 'asc';

    @observable _orderBy: keyof INotesRepoRow = 'title';

    @computed get orderBy() {
        return this._orderBy;
    }

    @computed get order() {
        return this._order;
    }

    @action public setOrderBy(orderBy: keyof INotesRepoRow, order: Order) {

        console.log("FIXME: setOrderBy: ", orderBy, order);
        this._orderBy = orderBy;
        this._order = order;
    }

}



export const [NotesRepoStoreProvider, useNotesRepoStoreDelegate] = createStoreContext(() => {
    return React.useMemo(() => new NotesRepoStore(), []);
})

export function useNotesRepoStore() {
    return useNotesRepoStoreDelegate();
}
