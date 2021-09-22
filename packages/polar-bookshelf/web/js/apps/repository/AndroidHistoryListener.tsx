import React from 'react';
import {useHistory} from "react-router-dom";

/**
 * Component for Android so that we can navigate history with the android back
 * button.
 */
export const AndroidHistoryListener = () => {

    const history = useHistory();

    const sendBackFailed = React.useCallback(() => {

        if ((window as any).ReactNativeWebView) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({
                type: 'android-go-back-exhausted'
            }))
        }

    }, []);

    const handler = React.useCallback((event: MessageEvent) => {

        if (event.data.type === 'android-go-back') {

            if (history.length > 0) {
                console.log("Going back as requested via postMessage: android-go-back: ", event.data);
                history.goBack();
            } else {
                console.warn("Can not go back with android-go-back.  No more history.");
                sendBackFailed();
            }
        }

    }, [history, sendBackFailed]);

    React.useEffect(() => {

        window.addEventListener('message', handler);

        return () => {
            window.removeEventListener('message', handler);
        }

    }, []);

    return null;

}
