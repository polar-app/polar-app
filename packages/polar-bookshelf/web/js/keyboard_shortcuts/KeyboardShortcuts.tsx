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

function createPredicate3(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    // TODO: there's a bug here in that if the user is doing ctrl+h but we are typing
    // ctrl+shift+h then we will match.

    return (event) => {


        function matchesModifier(key: string) {

            // console.log("keyboard shortcuts: key: " + key);
            // console.log("keyboard shortcuts: ctrlKey: " + event.ctrlKey);
            // console.log("keyboard shortcuts: metaKey: " + event.metaKey);
            // console.log("keyboard shortcuts: shiftKey: " + event.shiftKey);

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

        function matchesKey0() {
            return matchesModifier(keys[0]);
        }

        function matchesKey1() {
            return matchesModifier(keys[1]);
        }

        function matchesKey2() {

            const key = keys[2];

            if (key === event.key) {
                return true;
            }

            return false;

        }

        if (matchesKey0() && matchesKey1() && matchesKey2()) {
            return true;
        }

        return false;

    }

}


function createPredicate2(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    // TODO: there's a bug here in that if the user is doing ctrl+h but we are typing
    // ctrl+shift+h then we will match.

    return (event) => {

        function matchesKey0() {

            const key = keys[0];

            // console.log("keyboard shortcuts: key: " + key);
            // console.log("keyboard shortcuts: ctrlKey: " + event.ctrlKey);
            // console.log("keyboard shortcuts: metaKey: " + event.metaKey);
            // console.log("keyboard shortcuts: shiftKey: " + event.shiftKey);

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
        return event.key === keys[0] && ! (event.metaKey || event.ctrlKey || event.shiftKey);
    }

}


function createHandler(sequence: KeyBinding, handler: KeyboardShortcutEventHandler): KeyboardEventHandlerUsingPredicate {

    function createPredicate() {

        switch (sequence) {

            // HACK this is just a hack for + key bindings and we should migrate to a better parser eventually
            case "command++":
                return createPredicate2(['command', '+']);

            case "ctrl++":
                return createPredicate2(['ctrl', '+']);

        }

        const keys = sequence.split('+');

        switch (keys.length) {
            case 1:
                return createPredicate1(keys);
            case 2:
                return createPredicate2(keys);
            case 3:
                return createPredicate3(keys);
            default:
                throw new Error("Too many keys for event: " + keys.length);
        }

    }

    const predicate = createPredicate();

    return (event) => {

        if (predicate(event)) {
            event.stopPropagation();
            event.preventDefault();

            console.log("Executing handler for sequence: " + sequence);
            setTimeout(() => handler(event), 1);
            return true;
        }

        return false;

    }

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


type SequenceToHandler = [string, KeyboardShortcutEventHandler];
type SequenceToKeyboardEventHandlerPredicate = [string, KeyboardEventHandlerPredicate];

export const KeyboardShortcuts = deepMemo(function KeyboardShortcuts() {

    const {shortcuts, active} = useKeyboardShortcutsStore(['shortcuts', 'active']);
    const shortcutsRef = useRefWithUpdates(shortcuts);
    const activeRef = useRefWithUpdates(active);

    function computeKeyToHandlers() {

        function toKeyToHandler(keyboardShortcut: IKeyboardShortcutWithHandler):

            ReadonlyArray<SequenceToKeyboardEventHandlerPredicate> {

            function toKeyboardEventHandlerPredicate(seq: string) {
                return createHandler(seq, keyboardShortcut.handler);
            }

            return keyboardShortcut.sequences.map(seq => ([seq, toKeyboardEventHandlerPredicate(seq)]));

        }

        return arrayStream(Object.values(shortcutsRef.current))
            .flatMap(toKeyToHandler)
            .collect();

    }

    const keyToHandlers = useRefProvider(() =>  computeKeyToHandlers());

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (isIgnorableKeyboardEvent(event)) {
            return;
        }

        if (! activeRef.current) {
            // key bindings are deactivated.
            return;
        }

        for (const keyToHandler of keyToHandlers.current) {

            const handler = keyToHandler[1];

            if (handler(event)) {
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
