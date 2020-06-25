import React from 'react';
import {useFirestoreConnectivity} from "../../firebase/FirestoreHooks";
import CloudOffIcon from '@material-ui/icons/CloudOff';
import Button from '@material-ui/core/Button/Button';
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../hooks/lifecycle";

export function useOnline(): boolean | undefined {

    const [online, setOnline] = React.useState<boolean | undefined>(undefined);

    const onOnline = React.useCallback(() => {
        setOnline(navigator.onLine);
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('online', onOnline)
    })

    useComponentWillUnmount(() => {
        window.removeEventListener('online', onOnline)
    })

    return online;

}

export const CloudConnectivityButton = React.memo(() => {

    // TODO this does not work now because I have to use realtime database
    // but I have a post about this to resolve it:
    //
    // https://www.reddit.com/r/Firebase/comments/hf7r9c/how_do_you_detect_connected_presence_with/?

    // const connectivity = useFirestoreConnectivity();
    //

    const online = useOnline();

    if (online === false) {
        return (
            <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudOffIcon />}>
                Not Connected
            </Button>
        )
    }

    return null;

})
