export namespace HotKeyCallbacks {

    export function withPreventDefault(delegate: () => void) {

        return (event: KeyboardEvent | undefined) => {

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            delegate();

        }

    }

}
