import React from 'react';
import {AddFileDropzoneProvider} from './AddFileDropzoneStore';

export const AddFileDropzoneRoot: React.FC = React.memo(function AddFileDropzoneRoot(props) {

    return (
        <AddFileDropzoneProvider>
            <DragAndDropListener>
                {props.children}
            </DragAndDropListener>
        </AddFileDropzoneProvider>
    )

});

AddFileDropzoneRoot.displayName='AddFileDropzoneRoot';

const DragAndDropListener: React.FC = React.memo(function DragAndDropListener(props) {
    // useDragAndDropBackdropListener();
    // useDragAndDropImportListener();
    return <>{props.children}</>;
});
