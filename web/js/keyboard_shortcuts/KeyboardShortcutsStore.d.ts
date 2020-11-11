export declare type KeyboardEventHandler = (event: KeyboardEvent) => void;
export declare type KeyboardEventHandlerUsingPredicate = (event: KeyboardEvent) => boolean;
export declare type KeyBindingArray2 = readonly [string, string];
export declare type KeyBindingArray1 = readonly [string];
export declare type KeyBinding = string;
export interface IBaseKeyboardShortcut {
    readonly name: string;
    readonly description?: string;
    readonly sequences: ReadonlyArray<KeyBinding>;
    readonly priority?: number;
}
export interface IKeyboardShortcut extends IBaseKeyboardShortcut {
    readonly group?: string;
    readonly groupPriority?: number;
}
export interface IKeyboardShortcutWithHandler extends IKeyboardShortcut {
    readonly handler: KeyboardEventHandler;
}
interface IKeyboardShortcutsStore {
    readonly shortcuts: {
        [binding: string]: IKeyboardShortcutWithHandler;
    };
    readonly active: boolean;
}
interface IKeyboardShortcutsCallbacks {
    readonly addKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly removeKeyboardShortcut: (shortcut: IKeyboardShortcutWithHandler) => void;
    readonly setActive: (active: boolean) => void;
}
interface Mutator {
}
export declare const KeyboardShortcutsStoreProvider: import("../react/store/ObservableStore").ObservableStoreProviderComponent<IKeyboardShortcutsStore>, useKeyboardShortcutsStore: <K extends "active" | "shortcuts">(keys: readonly K[] | undefined, opts?: import("../react/store/ObservableStore").IUseStoreHooksOpts | undefined) => Pick<IKeyboardShortcutsStore, K>, useKeyboardShortcutsCallbacks: import("../react/store/ObservableStore").UseContextHook<IKeyboardShortcutsCallbacks>, useKeyboardShortcutsMutator: import("../react/store/ObservableStore").UseContextHook<Mutator>;
export {};
