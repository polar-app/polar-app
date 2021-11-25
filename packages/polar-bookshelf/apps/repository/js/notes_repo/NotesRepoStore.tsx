import {action, computed, makeObservable, observable} from "mobx";
import {INotesRepoRow} from "./NotesRepoTable2";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {Comparators} from "polar-shared/src/util/Comparators";
import Comparator = Comparators.Comparator;

export type Order = 'asc' | 'desc';

export class NotesRepoStore {

    @observable _order: Order = 'asc';

    @observable _orderBy: keyof INotesRepoRow = 'title';

    @observable _data: ReadonlyArray<INotesRepoRow> = [];

    @observable _view: ReadonlyArray<INotesRepoRow> = [];

    @observable _selected: ReadonlyArray<IDStr> = [];

    constructor() {
        makeObservable(this);
    }

    @computed get orderBy() {
        return this._orderBy;
    }

    @computed get order() {
        return this._order;
    }

    @computed get view() {
        return this._view;
    }

    @computed get selected() {
        return this._selected;
    }

    @action public setOrderBy(orderBy: keyof INotesRepoRow, order: Order) {
        this._orderBy = orderBy;
        this._order = order;
        this.updateView();
    }

    @action public setData(data: ReadonlyArray<INotesRepoRow>) {
        this._data = data;
        this.updateView();
    }

    @action private updateView() {

        const comparator = createComparatorWithOrder(this._orderBy, this._order);
        const view = [...this._data].sort(comparator);

        this.setView(view)

    }

    @action public setView(view: ReadonlyArray<INotesRepoRow>) {
        this._view = view;
    }

    @action public setSelected(selected: ReadonlyArray<IDStr>) {
        this._selected = selected;
    }

    @action public selectRow(viewID: IDStr,
                             event: React.MouseEvent,
                             type: SelectRowType) {


        const selected = SelectionEvents2.selectRow(viewID,
                                                    this._selected,
                                                    this._view,
                                                    event,
                                                    type);

        this.setSelected(selected || []);

    }

}

export const [NotesRepoStoreProvider, useNotesRepoStoreDelegate] = createStoreContext(() => {
    return React.useMemo(() => new NotesRepoStore(), []);
})

export function useNotesRepoStore() {
    return useNotesRepoStoreDelegate();
}

function createComparator(field: keyof INotesRepoRow): Comparator<INotesRepoRow> {

    switch (field) {

        case "title":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.title.localeCompare(b.title);
            }
        case "created":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.created.localeCompare(b.created);
            }
        case "updated":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.updated.localeCompare(b.updated);
            }
        case "id":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.id.localeCompare(b.id);
            }

    }

}

function createComparatorWithOrder(field: keyof INotesRepoRow, order: Order): Comparator<INotesRepoRow> {
    const comparator = createComparator(field);
    return order === 'asc' ? comparator : Comparators.reverse(comparator);
}
