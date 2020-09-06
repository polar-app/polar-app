/**
 * Handles listening for events and responding to them by creating the text
 * highlights.
 */
export namespace TextHighlighterListener {

    export function start() {

        function handleMessage(event: MessageEvent) {

            switch(event.data.type) {

            }

        }

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };

    }

}
