import React from 'react';
import {useHistory} from "react-router-dom";

/**
 * Component for Android so that we can navigate history with the android back
 * button.
 */
export const AndroidHistoryListener = () => {

    const history = useHistory();

    const depthRef = React.useRef(0);

    React.useEffect(() => {

        const unsubscriber = history.listen((location, action) => {

            switch (action) {

                case "PUSH":
                    ++depthRef.current;
                    break;
                case "POP":
                    --depthRef.current;
                    break;
                case "REPLACE":
                    // TODO: what happens if we goBack, then replace, does it
                    // prune the parents?
                    break;

            }

        });

        return () => {
            unsubscriber();
        }

    }, [history]);

    const sendBackFailed = React.useCallback(() => {

        if ((window as any).ReactNativeWebView) {
            (window as any).ReactNativeWebView.postMessage(JSON.stringify({
                type: 'android-go-back-exhausted'
            }))
        }

    }, []);

    const handler = React.useCallback((event: MessageEvent) => {

        if (event.data.type === 'android-go-back') {

            // https://stackoverflow.com/questions/3588315/how-to-check-if-the-user-can-go-back-in-browser-history-or-not
            if (depthRef.current > 0) {
                console.log("Going back successful as requested via postMessage: android-go-back: ", event.data);
                history.goBack();
            } else {
                console.warn(`Can not go back with android-go-back.  No more history: ` + document.referrer);
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
