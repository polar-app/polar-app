export type AnimationFrameDebouncer = () => void;

export namespace AnimationFrameDebouncers {

    /**
     * Debouncer that use requestAnimationFrame
     */
    export function withAnimationFrame(delegate: () => void): AnimationFrameDebouncer{

        let pending: boolean = false;

        function handleDelegate() {

            try {
                delegate();
            } finally {
                pending = false;
            }

        }

        return () => {

            if (pending) {
                return;
            }

            window.requestAnimationFrame(handleDelegate);

            pending = true;

        };

    }

}
