import {UpdateProgressCallback} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler = (uploadProgress: UpdateProgressCallback, onWriteController : OnWriteController) => Promise<void>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useUploadHandlers() {

    return React.useCallback((uploadHandlers: ReadonlyArray<UploadHandler>) => {

        let controller: WriteController | undefined;
        function onWriteController(newController: WriteController) {
            controller = newController;
        }

        function onCancel() {

            if (! controller) {
                return;
            }

            controller.cancel();

        }

        let idx = 0;
        for (const uploadHandler of uploadHandlers) {
            ++idx;

            const updateProgress = await uploadProgressTaskbar(idx, uploadHandlers.length, {onCancel});

            try {
                await uploadHandler(updateProgress, onWriteController);
            } finally {
                updateProgress(100);
            }

        }

    })
    

}