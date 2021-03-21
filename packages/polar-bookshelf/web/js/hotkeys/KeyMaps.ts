import {
    ActionName, KeyEventName,
    KeyMap,
    KeySequence,
    MouseTrapKeySequence
} from "react-hotkeys";

export namespace KeyMaps {

    export interface SparseKeyMapOption {

        sequences: MouseTrapKeySequence[];

        /**
         * Defaults to keydown when not specified.
         */
        action?: KeyEventName;

        name?: string;

        description?: string;

    }

    export type SparseKeyMap = { [key in ActionName]: SparseKeyMapOption };

    export interface IKeyMapOpts {
        readonly keyMap: SparseKeyMap;
        readonly group?: string;
    }

    export function keyMap(opts: IKeyMapOpts): KeyMap {

        function toKeySequence(option: SparseKeyMapOption): KeySequence {

            const action = option.action || 'keydown';

            return {
                sequence: option.sequences[0],
                sequences: option.sequences,
                action,
                name: option.name,
                group,
                description: option.description
            }

        }

        const result: KeyMap = {};

        const {group, keyMap} = opts;

        for (const key of Object.keys(keyMap)) {
            result[key] = toKeySequence(keyMap[key]);
        }

        return result;

    }

}
