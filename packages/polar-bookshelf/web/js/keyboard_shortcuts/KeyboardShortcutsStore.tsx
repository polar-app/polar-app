import React from 'react';
import {Provider} from "polar-shared/src/util/Providers";
import {createObservableStore, SetStore} from "../react/store/ObservableStore";
import {Arrays} from "polar-shared/src/util/Arrays";
import {RingBuffers} from "polar-shared/src/util/RingBuffers";
import IRingBuffer = RingBuffers.IRingBuffer;

export interface IKeyboardShortcutEvent {
    preventDefault: () => void;
    stopPropagation: () => void;
}

export type KeyboardShortcutEventHandler = (event: KeyboardEvent, keyBuffer: IRingBuffer<string>) => void;

export type KeyboardEventHandlerUsingPredicate = (event: KeyboardEvent, keyBuffer: IRingBuffer<string>) => boolean;

export type KeyBindingArray2 = readonly [string, string];
export type KeyBindingArray1 = readonly [string];

export type KeyBindingPlatform = 'macos' | 'windows' | 'linux'

export interface KeyBinding {

    readonly keys: string;

    /**
     * Platforms MUST be specified, rather than inferred, because each OS has
     * its own conflict map that we have to deal with.
     *
     * Even simple bindings like F10 might not be workable on certain platforms even though
     * it doesn't contain a command or a control.
     */
    readonly platforms: ReadonlyArray<KeyBindingPlatform>;

};

export interface IBaseKeyboardShortcut {
    readonly name: string;
    readonly icon?: React.ReactNode,
    readonly description?: string;
    readonly sequences: ReadonlyArray<KeyBinding>;
    readonly priority?: number;

    /**
     * This is used to determine whether to ignore the shortcut
     * if a text editor is currently in focus (input, textarea, or contenteditable)
     */
    readonly ignorable?: boolean;
}

export interface IKeyboardShortcut extends IBaseKeyboardShortcut {
    readonly group?: string;
    readonly groupPriority?: number;
}

export interface IKeyboardShortcutWithHandler extends IKeyboardShortcut {
    readonly handler: KeyboardShortcutEventHandler;
}

export type ShortcutEntry = {
    registered: IKeyboardShortcutWithHandler[],
    active: IKeyboardShortcutWithHandler,
};

interface IKeyboardShortcutsStore {

    /**
     * The current keyboard bindings.
     */
    readonly shortcuts: {
        [binding: string]: ShortcutEntry;
    };

    /**
     * True when the keyboard bindings are active so we could disable them
     * temporarily.
     */
    readonly active: boolean;

}

interface IKeyboardShortcutsCallbacks {
    readonly addKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly removeKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly setActive: (active: boolean) => void;
}

const initialStore: IKeyboardShortcutsStore = {
    shortcuts: {},
    active: true
}

interface Mutator {
}

function mutatorFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                        setStore: SetStore<IKeyboardShortcutsStore>): Mutator {
    return {};
}

function callbacksFactory(storeProvider: Provider<IKeyboardShortcutsStore>,
                          setStore: (store: IKeyboardShortcutsStore) => void,
                          mutator: Mutator): IKeyboardShortcutsCallbacks {

    function addKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        let storedShortcut = shortcuts[sequence.keys];
        if (! storedShortcut) {
            storedShortcut = { registered: [shortcut], active: shortcut };
        } else {
            storedShortcut.registered.unshift(shortcut);
            storedShortcut.active = shortcut;
        }
        shortcuts[sequence.keys] = storedShortcut;
        setStore({...store, shortcuts});
    }

    function removeKeyboardShortcut(shortcut: IKeyboardShortcutWithHandler) {
        const store = storeProvider();
        const shortcuts = {...store.shortcuts};
        const sequence = Arrays.first(shortcut.sequences)!;
        const storedShortcut = shortcuts[sequence.keys];
        if (storedShortcut) {
            storedShortcut.registered = storedShortcut.registered.filter(x => shortcut !== x);
            storedShortcut.active = storedShortcut.registered[0];
            if (storedShortcut.registered.length === 0) {
                delete shortcuts[sequence.keys];
            }
            setStore({...store, shortcuts});
        }
    }

    function setActive(active: boolean) {
        const store = storeProvider();
        setStore({...store, active});
    }

    return {addKeyboardShortcut, removeKeyboardShortcut, setActive};

}

export const [KeyboardShortcutsStoreProvider, useKeyboardShortcutsStore, useKeyboardShortcutsCallbacks, useKeyboardShortcutsMutator]
    = createObservableStore<IKeyboardShortcutsStore, Mutator, IKeyboardShortcutsCallbacks>({
        initialValue: initialStore,
        mutatorFactory,
        callbacksFactory
    });

