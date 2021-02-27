import * as React from "react";
import {createReactiveStore} from "../../react/store/ReactiveStore";
import {IDStr} from "polar-shared/src/util/Strings";
import {action, makeObservable, observable} from "mobx"
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {KeyBinding} from "../../keyboard_shortcuts/KeyboardShortcutsStore";

export interface IActionMenuPosition {

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

/**
 * Returns items that match the prompt, ideally sorted by priority.
 */
export type ActionMenuItemsProvider = (prompt: string) => ReadonlyArray<IActionMenuItem>;

/**
 * Represents an item that can be selected but no action.  The action is just
 * given the ID so that ID must be unique so that the action can handle it
 * properly.
 */
export interface IActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: IDStr;

    /**
     * The text to show the user in the UI.
     */
    readonly text: string;

    /**
     * The group for the command, if any.
     */
    readonly group?: string;

    readonly icon?: React.ReactNode,

    readonly sequences?: ReadonlyArray<KeyBinding>;

    /**
     * Longer description of this command. Not just the shorter 'text' description.
     */
    readonly description?: string;

}

export interface IActionMenuItemExecuted {

    /**
     * The action that was executed.
     */
    readonly id: string;

}

export interface IActionState {

    /**
     * Where to display the action menu...
     */
    readonly position: IActionMenuPosition;

    readonly items: ReadonlyArray<IActionMenuItem>

    // /**
    //  * Callback on the state that the user wanted to be executed.
    //  */
    // readonly onCommand: (executed: IActionMenuItemExecuted) => void;

}

export function createItemsProvider(items: ReadonlyArray<IActionMenuItem>): ActionMenuItemsProvider {

    return (prompt) => {
        const promptLower = prompt.toLowerCase();
        return items.filter(current => current.text.toLowerCase().indexOf(promptLower) !== -1);
    };

}

export class ActionStore {

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
    }

    @action public updateState(items: ReadonlyArray<IActionMenuItem>) {

        if (! this.state) {
            console.warn("No state");
            return;
        }

        this.setState({...this.state, items});

    }

}

export const [CommandActionMenuStoreProvider, useCommandActionMenuStore] = createReactiveStore(() => new ActionStore())
