import React from 'react';
import {AddFileDropzoneProvider} from './AddFileDropzoneStore';
import {
    useDragAndDropBackdropListener,
    useDragAndDropImportListener
} from "./AddFileDropzone";

export const AddFileDropzoneRoot: React.FC = React.memo(function AddFileDropzoneRoot({ children }) {

    return (
        <AddFileDropzoneProvider>
            <DragAndDropListener>
                {children}
            </DragAndDropListener>
        </AddFileDropzoneProvider>
    )

});

const DragAndDropListener: React.FC = React.memo(function DragAndDropListener({ children }) {
    useDragAndDropBackdropListener();
    useDragAndDropImportListener();
    return <>{children}</>;
});
