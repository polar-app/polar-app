import {UpdateProgressCallback, useUploadProgressTaskbar} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler = (uploadProgress: UpdateProgressCallback, onWriteController : OnWriteController) => Promise<void>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useUploadHandlers() {

    const uploadProgressTaskbar = useUploadProgressTaskbar();

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

        for (const [idx, uploadHandler] of uploadHandlers.entries()) {

            // TODO: work toward keeping ONE snackbar up the whole time,..
            const updateProgress = await uploadProgressTaskbar(idx + 1, uploadHandlers.length, {onCancel});

            try {
                await uploadHandler(updateProgress, onWriteController);
            } finally {
                updateProgress(100);
            }

            if (cancelled) {
                break;
            }

        }

    }, [uploadProgressTaskbar])

}