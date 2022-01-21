import {createStoreContext} from "../../../../web/js/react/store/StoreContext";
import {action, computed, makeObservable, observable} from "mobx"
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import React from "react";

interface IContextMenuActive<O> {
    readonly mouseX: number;
    readonly mouseY: number;

    readonly origin: O | undefined;
}

export class MUIContextMenuStore<O> {

    @observable _active: IContextMenuActive<O> | undefined = undefined;

    private _id: string;

    constructor() {
        this._active = undefined;
        this._id = Hashcodes.createRandomID({len: 8})
        makeObservable(this);
    }

    get id(): string {
        return this._id;
    }

    @computed get active() {
        return this._active;
    }

    @action public setActive(active: IContextMenuActive<O> | undefined) {
        this._active = active;
    }

}

export function createContextMenuStore<O>() {

    return createStoreContext(() => {
        return React.useMemo(() => new MUIContextMenuStore<O>(), []);
    });

}



