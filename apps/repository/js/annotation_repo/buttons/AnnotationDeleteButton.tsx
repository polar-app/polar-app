import * as React from 'react';
import {MUIDeleteIconButton} from "../../../../../web/js/mui/icon_buttons/MUIDeleteIconButton";

interface IProps {
    readonly onDelete: () => void;
}

export const AnnotationDeleteButton = (props: IProps) => {

    return (

        <MUIDeleteIconButton title="Are you sure you want to delete this item?"
                             subtitle="This is a permanent operation and can't be undone. "
                             type="danger"
                             onAccept={props.onDelete}/>

    );

};
