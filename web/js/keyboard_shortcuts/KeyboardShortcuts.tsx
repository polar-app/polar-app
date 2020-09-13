import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {
    IKeyboardShortcutWithHandler,
    KeyBinding,
    KeyboardEventHandler,
    useKeyboardShortcutsStore
} from "./KeyboardShortcutsStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

type KeyboardEventHandlerPredicate = (event: KeyboardEvent) => boolean;

function createPredicate2(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    return (event) => {

        function matchesKey0() {

            const key = keys[0];

            if (key === 'ctrl' && event.ctrlKey) {
                return true;
            }

            if (key === 'command' && event.metaKey) {
                return true;
            }

            if (key === 'shift' && event.shiftKey) {
                return true;
            }

            return false;

        }


        function matchesKey1() {

            const key = keys[1];

            if (key === event.key) {
                return true;
            }

            return false;

        }

        if (matchesKey0() && matchesKey1()) {
            return true;
        }

        return false;

    }

}

function createPredicate1(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    return (event): boolean => {
        return event.key === keys[0];
    }

}

function createHandler(sequence: KeyBinding, handler: KeyboardEventHandler): KeyboardEventHandler {

    const keys = sequence.split('+');

    function createPredicate() {
        switch (keys.length) {
            case 1:
                return createPredicate1(keys);
            case 2:
                return createPredicate2(keys);
            default:
                throw new Error("Too many keys for event: " + keys.length);
        }

    }

    const predicate = createPredicate();

    return (event) => {
        if (predicate(event)) {
            event.stopPropagation();
            event.preventDefault();

            setTimeout(() => handler(event), 1);

        }
    }

}

interface IProps {
}

type KeyToHandler = [string, KeyboardEventHandler];

export const KeyboardShortcuts = deepMemo((props: IProps) => {

    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts']);

    function toKeyToHandler(keyboardShortcut: IKeyboardShortcutWithHandler): ReadonlyArray<KeyToHandler> {
        return keyboardShortcut.sequences.map(seq => ([seq, keyboardShortcut.handler]));
    }

    const keyHandlers = arrayStream(Object.values(shortcuts))
                            .flatMap(toKeyToHandler)
                            .collect();

    /// FIXMEL the unregister won't work because it will change each time.
    const register = React.useCallback(() => {

        for (const [sequence, handler] of keyHandlers) {
            window.addEventListener('keypress', createHandler(sequence, handler))
        }

    }, [keyHandlers])

    const unregister = React.useCallback(() => {

        for (const [sequence, handler] of keyHandlers) {
            window.removeEventListener('keypress', createHandler(sequence, handler))
        }

    }, [keyHandlers])

    unregister();
    register();

    useComponentWillUnmount(() => {
        unregister();
    })

    return null;

});
