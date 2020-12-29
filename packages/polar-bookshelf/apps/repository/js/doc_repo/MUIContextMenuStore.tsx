import * as React from 'react';
import {createReactiveStore} from "../../../../web/js/react/store/ReactiveStore";
import {action, computed, makeObservable, observable} from "mobx"

interface IContextMenuActive<O> {
    readonly mouseX: number;
    readonly mouseY: number;

    readonly origin: O | undefined;
}

export class MUIContextMenuStore<O> {

    @observable _active: IContextMenuActive<O> | undefined = undefined;

    constructor() {
        this._active = undefined;
        makeObservable(this);
    }

    @computed get active() {
        return this._active;
    }

    @action public setActive(active: IContextMenuActive<O> | undefined) {
        this._active = active;
    }

}

export function createContextMenuStore<O>() {

    return createReactiveStore(() => new MUIContextMenuStore<O>())

}



