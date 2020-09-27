import {UpdateProgressCallback, useUploadProgressTaskbar, useBatchProgressTaskbar} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler = (uploadProgress: UpdateProgressCallback, onWriteController : OnWriteController) => Promise<void>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useUploadHandlers() {

    const createBatchProgressTaskbar = useBatchProgressTaskbar();

    return React.useCallback(async (uploadHandlers: ReadonlyArray<UploadHandler>) => {

        let controller: WriteController | undefined;

        function onWriteController(newController: WriteController) {
            controller = newController;
        }

        let cancelled: boolean = false;

        function onCancel() {

            if (! controller) {
                return;
            }

            controller.cancel();
            cancelled = true;

        }

        // TODO: work toward keeping ONE snackbar up the whole time,..
        const updateProgress = await createBatchProgressTaskbar( {
            message: "Starting upload...",
            onCancel,
            noAutoTerminate: true
        });

        const updateProgressCallback: UpdateProgressCallback = (progress) => {

            if (progress === 'terminate') {
                // this shouldn't happen...
                return;
            }

            updateProgress({progress});

        }

        try {

            for (const [idx, uploadHandler] of uploadHandlers.entries()) {

                try {
                    // have to call updateProgress here to reset from the previous iteration
                    updateProgress({
                        message: `Uploading file ${idx + 1} of ${uploadHandlers.length} ..`,
                        progress: 0
                    });

                    await uploadHandler(updateProgressCallback, onWriteController);

                } finally {
                    updateProgress({progress: 100});
                }

                if (cancelled) {
                    break;
                }

            }
        } finally {
            updateProgress('terminate');
        }

    }, [createBatchProgressTaskbar])

}