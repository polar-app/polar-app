import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {action, makeObservable, observable} from "mobx"
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

export interface ICommandActionMenuPosition {
    readonly top: number;
    readonly left: number;
}


export type CommandActionMenuItemProvider = (prompt: string) => ReadonlyArray<ICommandActionMenuItem>;

export interface ICommandActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: IDStr;

    /**
     * The text to show the user in the UI.
     */
    readonly text: string;

}

export interface IActionMenuItemExecuted {
    readonly id: string;
}

export interface IActionState {

    /**
     * Where to display the action menu...
     */
    readonly position: ICommandActionMenuPosition;

    readonly items: ReadonlyArray<ICommandActionMenuItem>

    // /**
    //  * Callback on the state that the user wanted to be executed.
    //  */
    // readonly onCommand: (executed: IActionMenuItemExecuted) => void;

}

export class CommandActionMenuStore {

    @observable state: IActionState | undefined = undefined;

    @observable id: string;

    constructor() {
        this.id = Hashcodes.createRandomID();
        makeObservable(this);
    }

    /**
     * Set the state or undefined if we want to clear it...
     */
    @action public setState(state: IActionState | undefined) {
        this.state = state;
        console.log("FIXME: state is now: ", this.state)
    }

    @action public updateState(items: ReadonlyArray<ICommandActionMenuItem>) {

        if (! this.state) {
            console.warn("No state");
            return;
        }

        this.setState({...this.state, items});

    }

}

export const [CommandActionMenuStoreProvider, useCommandActionMenuStore] = createReactiveStore(() => new CommandActionMenuStore())
