import {Platform, Platforms} from "polar-shared/src/util/Platforms";
import {KeyBinding} from "../keyboard_shortcuts/KeyboardShortcutsStore";

export namespace KeyBindings {

    export function platformSpecific(sequences: ReadonlyArray<KeyBinding>) {

        return sequences.filter(current => {

                const platform = Platforms.get();

                switch (platform) {
                    case Platform.MACOS:
                        return current.platforms.includes('macos');
                    case Platform.WINDOWS:
                        return current.platforms.includes('windows');
                    case Platform.LINUX:
                        return current.platforms.includes('linux');
                    default:
                        return false;
                }

            });

    }

}
