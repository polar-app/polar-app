import * as React from "react";
import {DropEvent} from 'react-dropzone';
import {
    useAddFileDropzoneCallbacks,
    useAddFileDropzoneStore
} from "./AddFileDropzoneStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../hooks/lifecycle";
import {AddFileHooks} from "./AddFileHooks";
import {AddFileDropzoneDialog} from "./AddFileDropzoneDialog";
import useAddFileImporter = AddFileHooks.useAddFileImporter;

function isFileTransfer(event: DragEvent) {

    if (! event.dataTransfer) {
        return false;
    }

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

export function useDragAndDropListener() {

    const {setActive} = useAddFileDropzoneCallbacks();

    const depth = React.useRef(0);

    const onDragEnter = React.useCallback((event: DragEvent) => {

        if (! isFileTransfer(event)) {
            return;
        }

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

export const AddFileDropzone = React.forwardRef((ref) => {

    const store = useAddFileDropzoneStore();
    const callbacks = useAddFileDropzoneCallbacks();

    function closeDialog() {
        callbacks.setActive(false);
    }

    return (
        <AddFileDropzoneDialog open={store.active}
                               noButtons={true}
                               onClose={closeDialog}/>
    );

});
