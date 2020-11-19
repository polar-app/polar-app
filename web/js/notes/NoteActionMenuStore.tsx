import {createRXJSStore} from "../react/store/RXJSStore";
import React from "react";
import {useRefValue} from "../hooks/ReactHooks";

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

    const setNoteActionMenuStore = useNoteActionMenuStore();
    const noteActionMenuStore = useNoteActionMenuStoreListener();
    const menuIndexRef = useRefValue(noteActionMenuStore.menuIndex);

    const setPosition = React.useCallback((position: IActionMenuPosition | undefined) => {

        setNoteActionMenuStore({
            position,
            menuIndex: noteActionMenuStore.menuIndex
        })

    }, [setNoteActionMenuStore, noteActionMenuStore.menuIndex]);

    const setMenuIndex = React.useCallback((menuIndex: number | undefined) => {
        setNoteActionMenuStore({...noteActionMenuStore, menuIndex})
    }, [noteActionMenuStore, setNoteActionMenuStore]);

    const executeCurrentAction = React.useCallback(() => {

        if (menuIndexRef.current !== undefined) {
            items[menuIndexRef.current].action();
        }

        setMenuIndex(undefined);

    }, [items, menuIndexRef, setMenuIndex])

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        function computeNextID() {

            if (menuIndexRef.current === undefined) {
                return 0;
            }

            return Math.min(items.length - 1, menuIndexRef.current + 1);

        }


        function computePrevID() {

            if (menuIndexRef.current === undefined) {
                return 0;
            }

            return Math.max(0, menuIndexRef.current - 1);

        }

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

            case 'ArrowDown':

                const nextID = computeNextID();
                setMenuIndex(nextID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowUp':

                const prevID = computePrevID();
                setMenuIndex(prevID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Enter':

                executeCurrentAction();

                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                break;

        }

    }, [setPosition]);

    const dismiss = React.useCallback(() => {
        setPosition(undefined)
    }, [setPosition]);

    return [onKeyDown, dismiss]

}
