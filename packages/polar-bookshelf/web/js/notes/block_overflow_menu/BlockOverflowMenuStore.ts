import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {action, makeObservable, observable} from "mobx";

type BlockOverflowMenuState = {
    readonly id: BlockIDStr;
    readonly elem: Element;
};

export class BlockOverflowMenuStore {

    /* eslint-disable functional/prefer-readonly-type */
    @observable private _state: BlockOverflowMenuState | undefined = undefined;
    /* eslint-enable functional/prefer-readonly-type */

    constructor() {
        makeObservable(this);
    }

    get state() {
        return this._state;
    }

    @action clearState() {
        this._state = undefined;
    }

    @action setState(state: BlockOverflowMenuState) {
        this._state = state;
    }
}
