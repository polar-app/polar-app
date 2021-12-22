import * as React from "react";
import InfoIcon from '@material-ui/icons/Info';
import {ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {useFirestore} from "../../FirestoreProvider";
import {SpacedRepCollection} from "polar-firebase/src/firebase/om/SpacedRepCollection";
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";

function useSpacedRepetitionPurger() {

    const {firestore, uid} = useFirestore();
    const dialogManager = useDialogManager();

    return React.useCallback(() => {

        async function doAsync() {

            if (uid) {
                await SpacedRepCollection.purge(firestore, uid);
                dialogManager.snackbar({message: "Spaced repetition data successfully purged."})
            } else {
                console.warn("No UID for purge");
            }

        }

        doAsync().catch(err => {
            console.error(err);
            dialogManager.snackbar({message: "Unable to purge spaced repetition data", type: 'error'});
        })

    }, [dialogManager, firestore, uid])
}

export const SpacedRepetitionPurgeListItem = () => {

    const purger = useSpacedRepetitionPurger();

    return (
        <ListItem button onClick={() => purger()}>
            <ListItemIcon>
            <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Purge Spaced Repetition Data" />
        </ListItem>
    );

}
