import React from "react";
import {MUIDialogControllerContext} from "./MUIDialogController";
import {Callback, NULL_FUNCTION} from "polar-shared/src/util/Functions";

export function useDialogManager() {
    return React.useContext(MUIDialogControllerContext);
}

export function useDeleteConfirmation(onAccept: Callback, onCancel: Callback = NULL_FUNCTION) {

    const dialogs = useDialogManager();

    return () => {
        dialogs.confirm({
            title: "Are you sure you want to delete these item(s)?",
            subtitle: "This is a permanent operation and can't be undone.  ",
            type: 'danger',
            onCancel,
            onAccept,
        });
    };

}
