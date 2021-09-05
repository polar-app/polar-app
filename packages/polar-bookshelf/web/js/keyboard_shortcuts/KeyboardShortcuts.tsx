import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {
    IKeyboardShortcutWithHandler,
    KeyBinding,
    KeyboardEventHandlerUsingPredicate,
    useKeyboardShortcutsStore
} from "./KeyboardShortcutsStore";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {useRefProvider, useRefWithUpdates} from '../hooks/ReactHooks';
import {SetArrays} from 'polar-shared/src/util/SetArrays';

type KeyboardEventHandlerPredicate = (event: KeyboardEvent, activeKeys: ReadonlyArray<string>) => boolean;

// FIXME: we have a problem where if we have two key bindings like:

// command+a+i
// a

// ... then it's possible that 'a' can be executed before 'command+a+i' because
// it's not really aware that 'command' is being held which is a modifier.

// this pattern applies to ALL of our key bindings to to things like
// shift+command as TWO meta actions can be triggered.
//
// FIXME: I think the solution here is to only keep the queue on multiple chars
// but then we STILL have the same issue with two or three keyboard shortcut
// options.

function createPredicateUsingArray(keys: ReadonlyArray<string>): KeyboardEventHandlerPredicate {

    // TODO: there's a bug here in that if the user is doing ctrl+h but we are typing
    // ctrl+shift+h then we will match.
    return (event: KeyboardEvent, activeKeys: ReadonlyArray<string>) => {

        const canonicalizeKey = (key: string) => {

            const lower = key.toLowerCase();

            switch(lower) {

                case 'meta':
                    return 'command';

                default:
                    return lower;

            }

        }

        const pressed = arrayStream(activeKeys)
                            .map(current => canonicalizeKey(current))
                            .collect()

        return SetArrays.equal(keys, pressed);

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
            case 1:
            case 2:
            case 3:
            case 4:
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

    // TODO: I do not actually think this will work because we have to keep
    // track fo keydown and keyup events and only execute a handler when it gets
    // back down to zero and then compare ALL the keys in the interim.
    //
    // This probably NEVER actually worked unfortunately.
    //
    // For example let's say we have to test for command+a+i
    //
    // We will get the following events

    // keydown: command
    // keydown: a
    // keydown: i
    // keyup: i
    // keyup: a
    // keyup: command

    // we have to evaluate on the LAST keyup... when our stack gets down to zero
    // and THEN compare if that's a valid key binding.
    //
    // very upset that I didn't see this before because it would have been
    // better/easier to not build a state machine for this.
    //
    // ANOTHER way to implement this COULD be to just keep persist ring buffer,
    // without keeping a queue length, and then just push to it for every keydown.
    //
    // we can just make it fixed to '3' and read the last '3' keys and compare
    // them after every keyup.

    interface IActiveKeys {
        [key: string]: boolean;
    }

    const activeKeysMap: IActiveKeys = React.useMemo(() => ({}), []);

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        if (! activeRef.current) {
            // key bindings are deactivated.
            return;
        }

        if (event.repeat) {
            return;
        }

        activeKeysMap[event.key] = true;

        const activeKeys = Object.keys(activeKeysMap);

        for (const [shortcut, seq, predicate] of keyToHandlers.current) {

            const { ignorable = true } = shortcut;

            if (predicate(event, activeKeys)) {

                if (ignorable && isIgnorableKeyboardEvent(event)) {
                    return;
                }

                event.stopPropagation();
                event.preventDefault();

                console.log("Executing handler for sequence: " , seq);

                setTimeout(() => shortcut.handler(event, activeKeys), 1);
                break;

            }

        }

    }, [activeRef, activeKeysMap, keyToHandlers]);

    const handleKeyUp = React.useCallback((event: KeyboardEvent) => {

        delete activeKeysMap[event.key];

    }, [activeKeysMap]);


    React.useEffect(() => {

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }

    }, [handleKeyDown, handleKeyUp])

    return null;

});
