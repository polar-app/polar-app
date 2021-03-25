import React from 'react';
import {AddFileDropzoneProvider} from './AddFileDropzoneStore';
import {
    useDragAndDropBackdropListener,
    useDragAndDropImportListener
} from "./AddFileDropzone";

interface IProps {
    readonly children: React.ReactElement;
}

export const AddFileDropzoneRoot = React.memo(function AddFileDropzoneRoot(props: IProps) {

    return (
        <AddFileDropzoneProvider>
            <DragAndDropListener>
                {props.children}
            </DragAndDropListener>
        </AddFileDropzoneProvider>
    )

});

AddFileDropzoneRoot.displayName='AddFileDropzoneRoot';

const DragAndDropListener = React.memo(function DragAndDropListener(props: IProps) {
    useDragAndDropBackdropListener();
    useDragAndDropImportListener();
    return props.children;
});
