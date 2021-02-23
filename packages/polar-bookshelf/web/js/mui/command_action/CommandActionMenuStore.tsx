import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {action, observable} from "mobx"

export interface IActionMenuPosition {
    readonly top: number;
    readonly left: number;
}


export type ActionMenuItemProvider = (prompt: string) => ReadonlyArray<IActionMenuItem>;

export interface IActionMenuItem {

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
     * The text the user has entered at the prompt.
     */
    readonly prompt: string;

    /**
     * Where to display the action menu...
     */
    readonly position: IActionMenuPosition;

    /**
     * The provider for the commands.
     */
    readonly itemsProvider: ActionMenuItemProvider;

    /**
     * Callback on the state that the user wanted to be executed.
     */
    readonly onCommand: (executed: IActionMenuItemExecuted) => void;

}

export class CommandActionMenuStore {

    @observable state: IActionState | undefined = undefined;

    @action
    public setState(state: IActionState | undefined) {
        this.state = state;
    }

}

export const [CommandActionStoreProvider, useCommandActionStore] = createReactiveStore(() => new CommandActionMenuStore())
