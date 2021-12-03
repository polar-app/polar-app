import {action, computed, makeObservable, observable} from "mobx";
import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import * as React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {SelectionEvents2, SelectRowType} from "../doc_repo/SelectionEvents2";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {Comparators} from "polar-shared/src/util/Comparators";
import {Sorting} from "../doc_repo/Sorting";
import {Device} from "polar-shared/src/util/Devices";
import Comparator = Comparators.Comparator;

export type Order = 'asc' | 'desc';

export type Opener = (id: IDStr) => void;

export interface BaseD {
    readonly id: string;
}

export interface BaseR {
    readonly id: string;
}


export interface IColumnDescriptor<R extends BaseR> {

    readonly disablePadding: boolean;

    readonly id: keyof R;

    readonly label: string;

    readonly defaultLabel?: string;

    readonly width: string;

    readonly defaultOrder: Sorting.Order;

    /**
     * Specify the devices on which this column is supported. When undefined we
     * show this on all devices.
     */
    readonly devices?: ReadonlyArray<Device>;

    readonly type: 'number' | 'text' | 'date'

}

export type ColumnDescriptors<R extends BaseR> = ReadonlyArray<IColumnDescriptor<R>>;

export class TableGridStore<D extends BaseD, R extends BaseR> {

    @observable _order: Order = 'asc';

    @observable _orderBy: keyof R;

    @observable _data: ReadonlyArray<D> = [];

    @observable _view: ReadonlyArray<R> = [];

    @observable _selected: ReadonlyArray<IDStr> = [];

    @observable _opener: Opener = NULL_FUNCTION;

    public comparatorFactory: ComparatorFactory<D, R>;

    public columnDescriptors: ColumnDescriptors<R>;

    public toRow: DataToRowConverter<D, R>;

    constructor(opts: ICreateTableGridStoreOpts<D, R>) {

        this.comparatorFactory = opts.comparatorFactory;
        this.columnDescriptors = opts.columnDescriptors;
        this.toRow = opts.toRow;

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

    @action public setData(data: ReadonlyArray<D>) {
        this._data = data;
        this.updateView();
    }

    @action private updateView() {

        // TODO: this would be much faster if we did this with docChanges rather than mapping
        // over all them again.

        const comparator = this.comparatorFactory(this._orderBy, this._order);
        const view = [...this._data].sort(comparator).map(current => this.toRow(current))

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

type ComparatorFactory<D extends BaseD, R extends BaseR> = (field: keyof R, order: Order) => Comparator<D>;

type DataToRowConverter<D extends BaseD, R extends BaseR> = (data: D) => R;

export interface ICreateTableGridStoreOpts<D extends BaseD, R extends BaseR> {

    /**
     * Factory to build comparators to sort fields.
     */
    readonly comparatorFactory: ComparatorFactory<D, R>;

    /**
     * The initial order (asc or desc)
     */
    readonly order: Order;

    /**
     * The initial / default orderBy
     */
    readonly orderBy: keyof R;

    readonly columnDescriptors: ColumnDescriptors<R>;

    /**
     * Convert raw data to a row
     */
    readonly toRow: DataToRowConverter<D, R>;

}

export function createTableGridStore<D extends BaseD, R extends BaseR>(opts: ICreateTableGridStoreOpts<D, R>) {

    return createStoreContext(() => {
        return React.useMemo(() => new TableGridStore<D, R>(opts), []);
    })

}