import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import {
    IBaseKeyboardShortcut,
    IKeyboardShortcut,
    IKeyboardShortcutWithHandler,
    KeyboardShortcutEventHandler,
    useKeyboardShortcutsCallbacks
} from "./KeyboardShortcutsStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";

export type KeyMap = {[key: string]: IKeyboardShortcut};
export type HandlerMap = {[key: string]: KeyboardShortcutEventHandler | null};

interface IProps {
    readonly keyMap: KeyMap;
    readonly handlerMap: HandlerMap;
}

export const GlobalKeyboardShortcuts = deepMemo(function GlobalKeyboardShortcuts(props: IProps) {

    const {addKeyboardShortcut, removeKeyboardShortcut} = useKeyboardShortcutsCallbacks();

    function toKeyboardShortcutWithHandler(key: string,
                                           shortcut: IKeyboardShortcut): IKeyboardShortcutWithHandler | undefined {

        const handler = props.handlerMap[key] || undefined;

        if (handler) {
            return {...shortcut, handler}
        } else {
            return undefined;
        }
    }

    const keyboardShortcuts =
        Object.entries(props.keyMap)
          .map(entry => toKeyboardShortcutWithHandler(entry[0], entry[1]))
          .filter(current => current !== undefined)
          .map(current => current!);

    useComponentDidMount(() => {
        for(const keyboardShortcut of keyboardShortcuts) {
            addKeyboardShortcut(keyboardShortcut);
        }
    });

    useComponentWillUnmount(() => {
        for(const keyboardShortcut of keyboardShortcuts) {
            removeKeyboardShortcut(keyboardShortcut);
        }
    })

    return null;

});


export interface IKeyMapWithGroup {
    readonly group: string;
    readonly groupPriority?: number;
    readonly keyMap: {[key: string]: IBaseKeyboardShortcut};
}

export function keyMapWithGroup(opts: IKeyMapWithGroup): KeyMap {

    function toKeyboardShortcut(option: IBaseKeyboardShortcut): IKeyboardShortcut {

        return {
            sequences: option.sequences,
            name: option.name,
            icon: option.icon,
            description: option.description,
            priority: option.priority,
            group,
            groupPriority: groupPriority !== undefined ? groupPriority : 0
        }

    }

    const result: KeyMap = {};

    const {group, groupPriority, keyMap} = opts;

    for (const key of Object.keys(keyMap)) {
        result[key] = toKeyboardShortcut(keyMap[key]);
    }

    return result;

}
