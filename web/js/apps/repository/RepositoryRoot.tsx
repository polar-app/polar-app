import React from 'react';
import {AddFileDropzoneRoot} from "./upload/AddFileDropzoneRoot";

interface IProps {
    readonly children: React.ReactElement;
}

/**
 * Root components that are specific just to the Repository.
 */
export const RepositoryRoot = React.memo((props: IProps) => {

    return (
        <AddFileDropzoneRoot>
            {props.children}
        </AddFileDropzoneRoot>
    );

});
