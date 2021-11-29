import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {action, makeObservable, observable} from "mobx";

type BlockOverflowMenuState = {
    id: BlockIDStr;
    elem: Element;
};

export class BlockOverflowMenuStore {
    @observable private _state: BlockOverflowMenuState | undefined = undefined;

    constructor() {
        makeObservable(this);
    }

    get state() {
        return this._state;
    }

    @action clear() {
        this._state = undefined;
    }

    @action setState(state: BlockOverflowMenuState) {
        this._state = state;
    }
}
