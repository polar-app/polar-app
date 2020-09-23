import React from 'react';
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {WriteFileProgressListener, WriteFileProgress} from "../../../datastore/Datastore";
import { Percentage } from 'polar-shared/src/util/ProgressTracker';

export type UpdateProgressCallback = (progress: WriteFileProgress | number) => void;

export function useUploadProgressTaskbar() {

    const dialogManager = useDialogManager();

    return React.useCallback(async (upload: number, nrUploads: number): Promise<UpdateProgressCallback> => {

        const updateProgress =
            await dialogManager.taskbar({message: `Uploading ${upload} of ${nrUploads} file(s)`});

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