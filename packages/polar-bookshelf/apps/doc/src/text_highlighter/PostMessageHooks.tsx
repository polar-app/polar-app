import * as React from 'react';

/**
 * Use a window message listener but remove it when the component unmounts.
 */
export function useMessageListener(handler: (event: MessageEvent) => void) {

    React.useEffect(() => {

        window.addEventListener('message', handler);

        return () => {
            window.removeEventListener('message', handler);
        }

    }, [handler])

}
