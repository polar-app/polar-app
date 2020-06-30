import React from 'react';
import {AddFileDropzoneProvider} from './AddFileDropzoneStore';
import {useDragAndDropListener} from "./AddFileDropzone";

interface IProps {
    readonly children: React.ReactElement;
}

export const AddFileDropzoneRoot = React.memo((props: IProps) => {

    return (
        <AddFileDropzoneProvider>
            <DragAndDropListener>
                {props.children}
            </DragAndDropListener>
        </AddFileDropzoneProvider>
    )

});

const DragAndDropListener = React.memo((props: IProps) => {
    useDragAndDropListener();
    return props.children;
});
