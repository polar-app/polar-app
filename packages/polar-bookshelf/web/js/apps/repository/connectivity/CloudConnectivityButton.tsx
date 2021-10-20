import React from 'react';
import {CloudOffline} from './CloudOffline';

export function useOnline(): boolean{

    /**
     * Returns true of false if we are online or offline.
     */
    const [online, setOnline] = React.useState<boolean>(navigator.onLine);

    const onConnectivityChange = React.useCallback(() => {
        setOnline(navigator.onLine);
    }, []);

    React.useEffect(() => {

        window.addEventListener('online', onConnectivityChange)
        window.addEventListener('offline', onConnectivityChange)

        return () => {
            window.removeEventListener('online', onConnectivityChange)
            window.removeEventListener('offline', onConnectivityChange)
        }

    }, [onConnectivityChange]);

    return online;

}

export const CloudConnectivityButton = React.memo(function CloudConnectivityButton() {

    // TODO this does not work now because I have to use realtime database
    // but I have a post about this to resolve it:
    //
    // https://www.reddit.com/r/Firebase/comments/hf7r9c/how_do_you_detect_connected_presence_with/?

    // const connectivity = useFirestoreConnectivity();

    const online = useOnline();

    if (! online) {

        // {/*<Button*/}
        // {/*    variant="contained"*/}
        // {/*    color="secondary"*/}
        // {/*    startIcon={<CloudOffIcon />}>*/}
        // {/*    Not Connected*/}
        // {/*</Button>*/}

        return (
            <CloudOffline/>
        );

    }

    return null;

});
