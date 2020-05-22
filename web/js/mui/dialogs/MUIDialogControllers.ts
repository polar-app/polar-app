import React from "react";
import {MUIDialogControllerContext} from "./MUIDialogController";
import {
    Callback,
    Callback1,
    NULL_FUNCTION
} from "polar-shared/src/util/Functions";

export function useDialogManager() {
    return React.useContext(MUIDialogControllerContext);
}

export function useDeleteConfirmation<T>(onAccept: Callback1<ReadonlyArray<T>>,
                                         onCancel: Callback = NULL_FUNCTION) {

    const dialogs = useDialogManager();

    return (values: ReadonlyArray<T>) => {
        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onCancel,
            onAccept: () => onAccept(values),
        });
    };

}
