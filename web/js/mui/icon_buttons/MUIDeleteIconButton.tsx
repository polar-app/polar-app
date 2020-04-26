import * as React from 'react';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import {useDialogManager} from "../../../spectron0/material-ui/dialogs/MUIDialogController";
import {MUIDeleteAction} from "../actions/MUIDeleteAction";

export const MUIDeleteIconButton = (props: MUIDeleteAction.IProps) => {

    const handleClick = MUIDeleteAction.create(props);

    const dialogs = useDialogManager();

    return (
        <IconButton onClick={() => handleClick(dialogs)}>
            <DeleteIcon/>
        </IconButton>
    );

};
