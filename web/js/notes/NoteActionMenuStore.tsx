import {createRXJSStore} from "../react/store/RXJSStore";
import React from "react";

export interface IActionMenuPosition {
    readonly top: number;
    readonly left: number;
}

export interface INoteActionMenuStore {

    /**
     * Online defined when we're active.
     */
    readonly position: IActionMenuPosition | undefined;

    /**
     * The currently active menu.
     */
    readonly menuIndex: number | undefined;

}

export const [NoteActionMenuStoreProvider, useNoteActionMenuStore, useNoteActionMenuStoreListener] =
    createRXJSStore<INoteActionMenuStore>();

export type ActionMenuOnKeyDown = (event: React.KeyboardEvent) => void;
export type ActionMenuDismiss = () => void;
export type ActionMenuTuple = [ActionMenuOnKeyDown, ActionMenuDismiss];

export function useNoteActionMenuKeyboardListener(): ActionMenuTuple {

    const setStore = useNoteActionMenuStore();
    const store = useNoteActionMenuStoreListener();

    const setPosition = React.useCallback((position: IActionMenuPosition | undefined) => {

        setStore({
            position,
            menuIndex: store.menuIndex
        })

    }, [setStore, store.menuIndex]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {

            case '/':

                if (window.getSelection()?.rangeCount === 1) {

                    const bcr = window.getSelection()!.getRangeAt(0).getBoundingClientRect();

                    setPosition({
                        top: bcr.bottom,
                        left: bcr.left,
                    });

                }

                break;
            case 'Escape':
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                setPosition(undefined);
                break;

        }

    }, [setPosition]);

    const dismiss = React.useCallback(() => {
        setPosition(undefined)
    }, [setPosition]);

    return [onKeyDown, dismiss]

}
