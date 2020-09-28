import {UpdateProgressCallback, useBatchProgressTaskbar} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler<V> = (uploadProgress: UpdateProgressCallback, onController : OnWriteController) => Promise<V>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useBatchUploader() {

    const createBatchProgressTaskbar = useBatchProgressTaskbar();

    return React.useCallback(async <V>(uploadHandlers: ReadonlyArray<UploadHandler<V>>): Promise<ReadonlyArray<V>> => {

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
            message: `Starting upload of ${uploadHandlers.length} files ... `,
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

            const results: V[] = [];

            for (const [idx, uploadHandler] of uploadHandlers.entries()) {

                try {
                    // have to call updateProgress here to reset from the previous iteration
                    updateProgress({
                        message: `Uploading file ${idx + 1} of ${uploadHandlers.length} ...`,
                        progress: 0
                    });

                    const result = await uploadHandler(updateProgressCallback, onWriteController);
                    results.push(result);

                } finally {
                    updateProgress({progress: 100});
                }

                if (cancelled) {
                    break;
                }

            }

            return results;

        } finally {
            updateProgress('terminate');
        }

    }, [createBatchProgressTaskbar])

}