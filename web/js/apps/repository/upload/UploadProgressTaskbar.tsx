import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {WriteFileProgressListener, WriteFileProgress} from "../../../datastore/Datastore";
import { Percentage } from 'polar-shared/src/util/ProgressTracker';

export type UpdateProgressCallback = (progress: WriteFileProgress | number) => void;

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