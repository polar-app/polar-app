import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {WriteFileProgressListener, WriteFileProgress} from "../../../datastore/Datastore";
import { Percentage } from 'polar-shared/src/util/ProgressTracker';
import {TaskbarDialogProps} from "../../../ui/dialogs/TaskbarDialog";

export type UpdateProgressCallback = (progress: WriteFileProgress | number | 'terminate') => void;

interface IOpts {
    readonly onCancel?: () => void;
}

export function useUploadProgressTaskbar() {

    const dialogManager = useDialogManager();

    return React.useCallback(async (upload: number, nrUploads: number, opts: IOpts = {}): Promise<UpdateProgressCallback> => {

        const message = `Uploading ${upload} of ${nrUploads} file(s)`;

        const updateProgress = await dialogManager.taskbar({
            message,
            ... opts
        });

        updateProgress({value: 'indeterminate'});

        return (progress) => {

            if (progress === 'terminate') {
                updateProgress(progress);
                return;
            }

            if (typeof progress === 'number') {
                updateProgress({value: progress as Percentage});
                return;
            }

            switch (progress.type) {
                case 'determinate':
                    updateProgress({value: progress.value});
                    break;
                case 'indeterminate':
                    updateProgress({value: 'indeterminate'});
                    break;
            }

        };

    }, [dialogManager]);

}

interface BatchProgressTaskbarOpts extends TaskbarDialogProps {
}

export interface BatchProgressUpdate {
    readonly message?: string;
    readonly progress: WriteFileProgress | number;
}

export type BatchProgressCallback = (update: BatchProgressUpdate | 'terminate') => void;

export function useBatchProgressTaskbar() {

    const dialogManager = useDialogManager();

    return React.useCallback(async (opts: BatchProgressTaskbarOpts): Promise<BatchProgressCallback> => {

        const updateProgress = await dialogManager.taskbar(opts);

        updateProgress({value: 'indeterminate'});

        return (update) => {

            if (update === 'terminate') {
                updateProgress(update);
                return;
            }

            if (typeof update.progress === 'number') {
                updateProgress({
                    message: update.message,
                    value: update.progress as Percentage
                });
                return;
            }

            switch (update.progress.type) {
                case 'determinate':
                    updateProgress({
                        message: update.message,
                        value: update.progress.value
                    });
                    break;
                case 'indeterminate':
                    updateProgress({
                        message: update.message,
                        value: 'indeterminate'
                    });
                    break;
            }

        };

    }, [dialogManager]);

}