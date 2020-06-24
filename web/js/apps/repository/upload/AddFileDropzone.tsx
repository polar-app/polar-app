import * as React from "react";
import {DropzoneArea} from "material-ui-dropzone";
import {useDropzone} from 'react-dropzone';
import {
    useAddFileDropzoneCallbacks,
    useAddFileDropzoneStore
} from "./AddFileDropzoneStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../hooks/lifecycle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import { DropEvent } from 'react-dropzone';
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {AddFileHooks} from "./AddFileHooks";
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



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textContainer: {
            margin: '5px 15px'
        }
    }),
);


export const AddFileDropzone = React.forwardRef((ref) => {

    const store = useAddFileDropzoneStore();
    const callbacks = useAddFileDropzoneCallbacks();
    const classes = useStyles();
    const addFileImporter = useAddFileImporter();

    function closeDialog() {
        callbacks.setActive(false);
    }

    function onDrop(files: File[], event: DropEvent) {
        closeDialog();

        console.log("Got files: ", files);

        addFileImporter(files);

    }

    return (
        <Dialog open={store.active}
                maxWidth="lg"
                onClose={closeDialog}>

            <DialogTitle>
                Upload PDF and EPUB Files
            </DialogTitle>
            <DialogContent>
                <div className="mt-2 mb-4">
                    <DropzoneArea
                        classes={classes}
                        dropzoneText="Drag and drop PDF or EPUB files to Upload"
                        showPreviews={false}
                        showPreviewsInDropzone={false}
                        onDrop={onDrop}
                        acceptedFiles={['application/pdf', 'application/epub+zip']}
                        maxFileSize={500000000}/>
                </div>
            </DialogContent>
        </Dialog>

    );
});
