import {UpdateProgressCallback, useBatchProgressTaskbarFactory} from "./UploadProgressTaskbar";
import {WriteController} from "../../../datastore/Datastore";
import React from 'react';

export type OnWriteController = (controller: WriteController) => void;
export type UploadHandler<V> = (uploadProgress: UpdateProgressCallback, onController : OnWriteController) => Promise<V>;

/**
 * Create a batch uploader which supports suspend and resume.  We have to use a factor to create functions used
 * that create the uploaders individually.
 */
export function useBatchUploader() {

    const batchProgressTaskbarFactory = useBatchProgressTaskbarFactory();
    const cancelled = React.useRef(false);

    return React.useCallback(async <V>(uploadHandlers: ReadonlyArray<UploadHandler<V>>): Promise<ReadonlyArray<V>> => {

        let controller: WriteController | undefined;

        function onWriteController(newController: WriteController) {
            controller = newController;
        }

        function onCancel() {

            cancelled.current = true;

            if (! controller) {
                return;
            }

            controller.cancel();

        }

        // TODO: work toward keeping ONE snackbar up the whole time,..
        const batchProgressTaskbar = await batchProgressTaskbarFactory( {
            message: `Starting upload of ${uploadHandlers.length} files ... `,
            onCancel,
            noAutoTerminate: true
        });

        const updateProgressCallback: UpdateProgressCallback = (progress) => {

            if (progress === 'terminate') {
                // this shouldn't happen...
                return;
            }

            batchProgressTaskbar.update({progress});

        }

        try {

            const results: V[] = [];

            for (const [idx, uploadHandler] of uploadHandlers.entries()) {

                try {

                    // have to call updateProgress here to reset from the previous iteration
                    batchProgressTaskbar.update({
                        message: `Uploading file ${idx + 1} of ${uploadHandlers.length} ...`,
                        progress: 0
                    });

                    const result = await uploadHandler(updateProgressCallback, onWriteController);
                    results.push(result);

                } catch (e) {

                    // NOTE that the firestore devs misspelled cancelled as canceled
                    // so we're checking for both strings so if they ever change it
                    // we're good
                    if (['cancelled', 'canceled'].includes((e as any).code) || ['storage/cancelled', 'storage/canceled'].includes((e as any).code_)) {
                        // this is acceptable as the user cancelled the upload
                        console.log("Caught cancelled upload exception");
                    } else {
                        throw e;
                    }

                } finally {
                    batchProgressTaskbar.update({progress: 100});
                }

                if (cancelled.current) {
                    break;
                }

            }

            return results;

        } finally {
            batchProgressTaskbar.update('terminate');
            batchProgressTaskbar.destroy();

            cancelled.current = false;
        }

    }, [batchProgressTaskbarFactory])

}
