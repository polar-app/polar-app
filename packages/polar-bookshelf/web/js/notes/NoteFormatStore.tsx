import * as React from "react";
import {action, makeObservable, observable} from "mobx"
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import { createReactiveStore } from "../react/store/ReactiveStore";

export interface INoteFormatBarPosition {

    /**
     * Where we should be placing the menu when it needs to be ABOVE the text.
     */
    readonly bottom: number;

    /**
     * Where we should be placing the menu when it needs to be BELOW the text.
     */
    readonly top: number;

    readonly left: number;
}

export interface INoteFormatState {

    /**
     * Where to display the action menu...
     */
    readonly position: INoteFormatBarPosition;

}

export class NoteFormatStore {

    @observable state: INoteFormatState | undefined = undefined;

    @observable id: string;

    constructor() {
        this.id = Hashcodes.createRandomID();
        makeObservable(this);
    }

    /**
     * Set the state or undefined if we want to clear it...
     */
    @action public setState(state: INoteFormatState | undefined) {
        this.state = state;
    }

}

export const [NoteFormatStoreProvider, useNoteFormatStore] = createReactiveStore(() => new NoteFormatStore())
