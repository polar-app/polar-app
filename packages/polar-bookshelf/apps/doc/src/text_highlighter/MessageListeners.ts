export namespace MessageListeners {

    export function createListener<T>(type: string, handler: (value: T) => void) {

        return (event: MessageEvent) => {
            if (event.data.type === type) {
                handler(event.data.value);
            }
        }

    }

    export type MessageDispatcher<M> = (message: M) => void;

    export function createDispatcher<M>(type: string): MessageDispatcher<M> {

        function computeTarget(): Window {

            let result: Window = window;

            while(result.parent && result.parent !== result) {
                result = result.parent;
            }

            return result;

        }

        const target = computeTarget();

        return (message: M) => {
            target.postMessage({type, value: message}, '*');
        }

    }

}
