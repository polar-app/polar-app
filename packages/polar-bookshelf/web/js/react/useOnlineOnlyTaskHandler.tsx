import React from 'react';
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export function useOnlineOnlyTaskHandler<V>(delegate: (value: V) => void) {

    const dialogManger = useDialogManager();

    return React.useCallback((value: V): void => {

        if (! navigator.onLine) {

            dialogManger.dialog({
                type: 'error',
                title: "Can't perform action while offline",
                body: (
                    <div>
                        Looks like you're currently offline and this action requires an Internet connection.
                    </div>
                ),
                onAccept: NULL_FUNCTION
            })

            return;
        }

        delegate(value);

    }, [dialogManger, delegate]);

}
