import React from "react";
import {DialogManager} from "./MUIDialogController";
import {Callback, Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useLogger} from "../MUILogger";
import {createValueStore} from "../../stores/ValueStore";

export const [DialogManagerProvider, useDialogManager, useDialogManagerSetter] = createValueStore<DialogManager>()

interface ILatentActionOpts {
    readonly message: string;
    readonly action: () => Promise<void>;
}

/**
 * Taskbar so that we tell the user that something is in progress.
 */
export function useAsyncActionTaskbar() {
    const dialogs = useDialogManager();
    const logger = useLogger();

    return React.useCallback((opts: ILatentActionOpts) => {

        async function doAsync() {

            const taskbar = await dialogs.taskbar({
                message: opts.message
            });

            taskbar.update({value: 'indeterminate'})

            try {
                await opts.action();
            } finally {
                taskbar.update({value: 100})
            }

        }

        doAsync().catch(err => logger.error(err));

    }, [dialogs, logger]);

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
