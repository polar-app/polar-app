import * as React from "react";
import {
    useAddFileDropzoneCallbacks,
    useAddFileDropzoneStore
} from "./AddFileDropzoneStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../hooks/ReactLifecycleHooks";
import {AddFileDropzoneDialog2} from "./AddFileDropzoneDialog2";
import {useLogger} from "../../../mui/MUILogger";
import {AddFileHooks} from "./AddFileHooks";
import {Uploads} from "./Uploads";
import {UploadFilters} from "./UploadFilters";
import {FileSystemEntries} from "./FileSystemEntries";
import useAddFileImporter = AddFileHooks.useAddFileImporter;

function useDropHandler() {

    const log = useLogger();
    const addFileImporter = useAddFileImporter();

    return React.useCallback((event: DragEvent) => {

        event.preventDefault();

        async function doAsync() {

            // https://developers.google.com/web/updates/2012/07/Drag-and-drop-a-folder-onto-Chrome-now-available
            // https://www.html5rocks.com/en/tutorials/file/filesystem/
            // https://wiki.whatwg.org/wiki/DragAndDropEntries

            if (! event.dataTransfer) {
                return;
            }
            if (! event.dataTransfer.types) {
                return;
            }

            if (! event.dataTransfer.types.includes('Files')) {
                return;
            }

            if (event.dataTransfer.items) {

                // note that we DO NOT filter this as it would filter
                // directories and we wouldn't recurse.  We instead have to
                // recurse to find all files and then we have to use the file
                // name as a filter.
                const items = Array.from(event.dataTransfer.items);

                const files = await FileSystemEntries.recurseDataTransferItems(items);
                const uploads = await Uploads.fromFileSystemEntries(files);
                addFileImporter(uploads);

            } else if (event.dataTransfer.files) {

                // This is a fail-over move for working with individual files
                // which applies to Firefox and older browsers

                const uploads = Uploads.fromFiles(event.dataTransfer.files);
                addFileImporter(uploads);

            }

        }

        doAsync()
            .catch(err => log.error(err));

    }, [addFileImporter]);

}

function isFileTransfer(event: DragEvent) {

    if (! event.dataTransfer) {
        return false;
    }

    console.log("Handling file transfer: ", event.dataTransfer.types);

    // https://stackoverflow.com/questions/6848043/how-do-i-detect-a-file-is-being-dragged-rather-than-a-draggable-element-on-my-pa

    if (event.dataTransfer.types) {

        // we need to detect if this is using the files types because
        // we do not have the actual files until the drop is complete.

        if (event.dataTransfer.types.includes('Files') ||
            event.dataTransfer.types.includes('application/x-moz-file')) {

            return true;
        }

    }

    if (! event.dataTransfer.files) {
        return false;
    }

    if (event.dataTransfer.files.length === 0) {
        return false;
    }

    return true;

}

/**
 * Listens for drag and drop and performs the actual import when files are
 * dropped
 *
 */
export function useDragAndDropImportListener() {

    const dropHandler = useDropHandler();

    const handleDragOver = React.useCallback((event: DragEvent) => {
        event.preventDefault();
    }, []);


    const handleDrop = React.useCallback((event: DragEvent) => {
        dropHandler(event);
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('drop', handleDrop);
    });

}

/**
 * Listens for files being imported and shows a backdrop telling the user what
 * to do.
 */
export function useDragAndDropBackdropListener() {

    const {setActive} = useAddFileDropzoneCallbacks();

    const depth = React.useRef(0);
    const onDragEnter = React.useCallback((event: DragEvent) => {

        if (! isFileTransfer(event)) {
            return;
        }

        // files are being dropped so we should focus this window otherwise it
        // gets confusing
        window.focus();

        if (depth.current === 0) {
            setActive(true);
        }

        ++depth.current;

    }, []);

    const onDragLeaveOrDrop = React.useCallback((event: DragEvent) => {

        if (! isFileTransfer(event)) {
            return;
        }

        --depth.current;

        if (depth.current === 0) {
            setActive(false);
        }

    }, []);

    useComponentDidMount(() => {
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragleave', onDragLeaveOrDrop);
        window.addEventListener('drop', onDragLeaveOrDrop);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('dragenter', onDragEnter);
        window.removeEventListener('dragleave', onDragLeaveOrDrop);
        window.removeEventListener('drop', onDragLeaveOrDrop);
    });

}

// useDropHandler

export const AddFileDropzone = React.forwardRef((props: any, ref) => {

    const {active} = useAddFileDropzoneStore(['active']);
    const callbacks = useAddFileDropzoneCallbacks();

    function closeDialog() {
        callbacks.setActive(false);
    }

    return (
        <AddFileDropzoneDialog2 open={active} onClose={closeDialog}/>
        // <AddFileDropzoneDialog open={active}
        //                        noActions={true}
        //                        onClose={closeDialog}/>
    );

});
