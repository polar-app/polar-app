import React from 'react';
import {useFirestoreConnectivity} from "../../firebase/FirestoreHooks";
import CloudOffIcon from '@material-ui/icons/CloudOff';
import Button from '@material-ui/core/Button/Button';

export const CloudConnectivityButton = React.memo(() => {

    // TODO this does not work now because I have to use realtime database
    // but I have a post about this to resolve it:
    //
    // https://www.reddit.com/r/Firebase/comments/hf7r9c/how_do_you_detect_connected_presence_with/?

    // const connectivity = useFirestoreConnectivity();
    //
    // if (connectivity === 'disconnected') {
    //     return (
    //         <Button
    //             variant="contained"
    //             color="secondary"
    //             startIcon={<CloudOffIcon />}>
    //             Delete
    //         </Button>
    //     )
    // }

    return null;

})
