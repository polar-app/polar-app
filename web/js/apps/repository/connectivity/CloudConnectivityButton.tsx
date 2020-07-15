import React from 'react';
import {useFirestoreConnectivity} from "../../../firebase/FirestoreHooks";
import CloudOffIcon from '@material-ui/icons/CloudOff';
import Button from '@material-ui/core/Button/Button';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../hooks/lifecycle";
import Tooltip from '@material-ui/core/Tooltip';

export function useOnline(): boolean{

    /**
     * Returns true of false if we are online or offline.
     */
    const [online, setOnline] = React.useState<boolean>(navigator.onLine);

    const onConnectivityChange = React.useCallback(() => {
        setOnline(navigator.onLine);
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('online', onConnectivityChange)
        window.addEventListener('offline', onConnectivityChange)
    })

    useComponentWillUnmount(() => {
        window.removeEventListener('online', onConnectivityChange)
        window.removeEventListener('offline', onConnectivityChange)
    })

    return online;

}

export const CloudConnectivityButton = React.memo(() => {

    // TODO this does not work now because I have to use realtime database
    // but I have a post about this to resolve it:
    //
    // https://www.reddit.com/r/Firebase/comments/hf7r9c/how_do_you_detect_connected_presence_with/?

    // const connectivity = useFirestoreConnectivity();

    const online = useOnline();

    if (! online) {
        return (
            <Tooltip title="You're currently offline and not connected to the cloud.">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudOffIcon />}>
                    Not Connected
                </Button>
            </Tooltip>
        )
    }

    return null;

});
