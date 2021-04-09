import {NoteIDStr} from "./BlocksStore";
import {action, computed, makeObservable, observable} from "mobx"

export class ReverseIndex {

    @observable private index: { [key: string]: NoteIDStr[] } = {};

    @computed get(target: NoteIDStr): ReadonlyArray<NoteIDStr> {
        return this.index[target] || [];
    }

    @action add(target: NoteIDStr, inbound: NoteIDStr) {

        const current = this.index[target];

        if (current) {
            current.push(inbound);
        } else {
            this.index[target] = [inbound];
        }

    }

    @action remove(target: NoteIDStr, inbound: NoteIDStr) {

        const current = this.index[target];

        if (current) {

            const idx = current.indexOf(inbound);

            if (idx > -1) {
                // this mutates the array under us and I don't necessarily like that
                // but it's a copy of the original to begin with.
                current.splice(idx, 1);
            }

            if (current.length === 0) {
                delete this.index[target];
            }

        }

    }

}
