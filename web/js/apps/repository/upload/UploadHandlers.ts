import {UpdateProgressCallback, useUploadProgressTaskbar, useUploadProgressTaskbar2} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler = (uploadProgress: UpdateProgressCallback, onWriteController : OnWriteController) => Promise<void>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useUploadHandlers() {

    const uploadProgressTaskbar = useUploadProgressTaskbar2();

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
        const updateProgress = await uploadProgressTaskbar( {
            message: "Starting upload...",
            onCancel,
            noAutoTerminate: true
        });

        try {
            for (const [idx, uploadHandler] of uploadHandlers.entries()) {

                try {
                    updateProgress(0);
                    await uploadHandler(updateProgress, onWriteController);
                } finally {
                    updateProgress(100);
                }

                if (cancelled) {
                    break;
                }

            }
        } finally {
            updateProgress('terminate');
        }

    }, [uploadProgressTaskbar])

}