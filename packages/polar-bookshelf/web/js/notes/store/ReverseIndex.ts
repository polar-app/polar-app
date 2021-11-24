import {action, computed, makeObservable, observable} from "mobx"
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

export class ReverseIndex {

    @observable private _index: { [key: string]: BlockIDStr[] } = {};

    constructor() {
        makeObservable(this);
    }

    @computed get index() {
        return this._index;
    }

    get(target: BlockIDStr): ReadonlyArray<BlockIDStr> {
        return this._index[target] || [];
    }

    @action add(target: BlockIDStr, inbound: BlockIDStr) {

        const current = this._index[target];

        if (current) {
            if (current.indexOf(inbound) === -1) {
                current.push(inbound);
            }
        } else {
            this._index[target] = [inbound];
        }

    }

    @action remove(target: BlockIDStr, inbound: BlockIDStr) {

        const current = this._index[target];

        if (current) {

            const idx = current.indexOf(inbound);

            if (idx > -1) {
                // this mutates the array under us and I don't necessarily like that
                // but it's a copy of the original to begin with.
                current.splice(idx, 1);
            }

            if (current.length === 0) {
                delete this._index[target];
            }

        }

    }

    public toJSON(): string {
        return JSON.stringify(this._index);
    }

}
