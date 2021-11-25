import {action, computed, makeObservable, observable} from "mobx";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Comparators} from "polar-shared/src/util/Comparators";
import Comparator = Comparators.Comparator;

export type Order = 'asc' | 'desc';

export type Opener = (id: IDStr) => void;

export interface BaseR {
    readonly id: string;
}

export class TableGridStore<R extends BaseR> {

    @observable _order: Order = 'asc';

    @observable _orderBy: keyof R;

    @observable _data: ReadonlyArray<R> = [];

    @observable _view: ReadonlyArray<R> = [];

    @observable _selected: ReadonlyArray<IDStr> = [];

    @observable _opener: Opener = NULL_FUNCTION;

    public comparatorFactory: ComparatorFactory<R>;

    constructor(opts: ICreateTableGridStoreOpts<R>) {

        this.comparatorFactory = opts.comparatorFactory;
        this._order = opts.order;
        this._orderBy = opts.orderBy;

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

    @action public setOrderBy(orderBy: keyof R, order: Order) {
        this._orderBy = orderBy;
        this._order = order;
        this.updateView();
    }

    @action public setData(data: ReadonlyArray<R>) {
        this._data = data;
        this.updateView();
    }

    @action private updateView() {

        const comparator = this.comparatorFactory(this._orderBy, this._order);
        const view = [...this._data].sort(comparator);

        this.setView(view)

    }

    @action public setView(view: ReadonlyArray<R>) {
        this._view = view;
    }

    @action public setSelected(selected: ReadonlyArray<IDStr> | 'all' | 'none') {

        switch (selected) {

            case 'all':
                this._selected = this._view.map(current => current.id)
                break;

            case 'none':
                this._selected = [];
                break;

            default:
                this._selected = selected;
                break;

        }

    }

    @action public setOpener(opener: Opener) {
        this._opener = opener;
    }

    @action public onOpen(id: IDStr) {
        this._opener(id);
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

type ComparatorFactory<R extends BaseR> = (field: keyof R, order: Order) => Comparator<R>;

export interface ICreateTableGridStoreOpts<R extends BaseR> {

    /**
     * Factory to build comparators to sort fields.
     */
    readonly comparatorFactory: ComparatorFactory<R>;

    /**
     * The initial order (asc or desc)
     */
    readonly order: Order;

    /**
     * The initial / default orderBy
     */
    readonly orderBy: keyof R;

}

export function createTableGridStore<R extends BaseR>(opts: ICreateTableGridStoreOpts<R>) {

    return createStoreContext(() => {
        return React.useMemo(() => new TableGridStore<R>(opts), []);
    })

}
