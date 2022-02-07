import React from 'react';
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export function useOnlineOnlyTaskHandler() {

    const dialogManger = useDialogManager();

    return React.useCallback(async (delegate: () => Promise<void>): Promise<void> => {

        if (! navigator.onLine) {

            dialogManger.dialog({
                type: 'error',
                title: "Can't perform action while offline",
                body: (
                    <div>
                        Looks like you're currently offline and this action requires an Intenret connection.
                    </div>
                ),
                onAccept: NULL_FUNCTION
            })

            return;
        }

        await delegate();

    }, [dialogManger]);

}
