import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";

function useDiskDatastoreMigration() {

    const dialogs = useDialogManager();

    return React.useCallback(() => {
        // noop
    },  [dialogs]);

}

export const DiskDatastoreMigrationScreen = React.memo(() => {

    // see if the disk data store is available...

    const diskDatastoreMigration = useDiskDatastoreMigration();

    return (
        <div>

        </div>
    );

})
