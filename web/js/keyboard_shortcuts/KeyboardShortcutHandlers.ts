import { IKeyboardShortcutEvent } from "./KeyboardShortcutsStore";

export namespace KeyboardShortcutHandlers {

    export function withPreventDefault(delegate: () => void) {

        return (event: IKeyboardShortcutEvent) => {

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            delegate();

        }

    }

}
