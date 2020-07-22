export namespace AnimationFrameDebouncer {

    /**
     * Debouncer that use requestAnimationFrame
     */
    export function withAnimationFrame(delegate: () => void): () => void {

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
