import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {
    IKeyboardShortcutWithHandler,
    KeyBinding,
    KeyboardShortcutEventHandler,
    useKeyboardShortcutsStore,
    KeyboardEventHandlerUsingPredicate
} from "./KeyboardShortcutsStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useRefProvider, useRefWithUpdates} from '../hooks/ReactHooks';

type KeyboardEventHandlerPredicate = (event: KeyboardEvent) => boolean;
function createPredicateUsingArray(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {
    // TODO: there's a bug here in that if the user is doing ctrl+h but we are typing
    // ctrl+shift+h then we will match.
    return (event) => {

        function matchesModifier(key: string) {

            if (key === 'ctrl' && event.ctrlKey) {
                return true;
            }
            if (key === 'command' && event.metaKey) {
                return true;
            }
            if (key === 'alt' && event.altKey) {
                return true;
            }
            if (key === 'shift' && event.shiftKey) {
                return true;
            }

            return event.key === key;

        }

        for(const current of keys) {
            if (! matchesModifier(current)) {
                return false;
            }
        }
        return true;
    }
}

function createPredicate(sequence: KeyBinding): KeyboardEventHandlerUsingPredicate {

    function createPredicate() {

        switch (sequence.keys) {

            // HACK this is just a hack for + key bindings and we should migrate to a better parser eventually
            case "command++":
                return createPredicateUsingArray(['command', '+']);

            case "ctrl++":
                return createPredicateUsingArray(['ctrl', '+']);

        }

        const keys = sequence.keys.split('+');

        switch (keys.length) {
            case 1: case 2: case 3: case 4:
                return createPredicateUsingArray(keys);
            default:
                throw new Error("Too many keys for event: " + keys.length);
        }

    }

    return createPredicate();
}

function isIgnorableKeyboardEvent(event: KeyboardEvent): boolean {

    // By default, all key events that originate from <input>, <select> or
    // <textarea>, or have a isContentEditable attribute of true

    if (event.target instanceof HTMLElement) {

        if(['input', 'select', 'textarea'].includes(event.target.tagName.toLowerCase())) {
            return true;
        }

        if (event.target.getAttribute('isContentEditable') === 'true') {
            return true;
        }

        if (event.target.getAttribute('contenteditable') === 'true') {
            return true;
        }

    }

    return false;

}
type SequenceToKeyboardEventHandlerPredicate = [IKeyboardShortcutWithHandler, KeyBinding, KeyboardEventHandlerPredicate];

export const KeyboardShortcuts = deepMemo(function KeyboardShortcuts() {

    const {shortcuts, active} = useKeyboardShortcutsStore(['shortcuts', 'active']);
    const shortcutsRef = useRefWithUpdates(shortcuts);
    const activeRef = useRefWithUpdates(active);

    function computeKeyToHandlers() {

        function toPredicate(keyboardShortcut: IKeyboardShortcutWithHandler): ReadonlyArray<SequenceToKeyboardEventHandlerPredicate> {

            function toKeyboardEventHandlerPredicate(seq: KeyBinding) {
                return createPredicate(seq);
            }

            return keyboardShortcut.sequences.map(seq => ([
                keyboardShortcut,
                seq,
                toKeyboardEventHandlerPredicate(seq),
            ]));

        }

        return arrayStream(Object.values(shortcutsRef.current))
            .map(x => x.active)
            .flatMap(toPredicate)
            .collect();

    }

    const keyToHandlers = useRefProvider(() =>  computeKeyToHandlers());

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (! activeRef.current) {
            // key bindings are deactivated.
            return;
        }

        for (const [shortcut, seq, predicate] of keyToHandlers.current) {
            const { ignorable = true } = shortcut;

            if (predicate(event)) {

                if (ignorable && isIgnorableKeyboardEvent(event)) {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                console.log("Executing handler for sequence: " + seq);
                setTimeout(() => shortcut.handler(event), 1);
                break;
            }

        }

    }, [activeRef, keyToHandlers]);

    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [handleKeyDown])

    return null;

});
