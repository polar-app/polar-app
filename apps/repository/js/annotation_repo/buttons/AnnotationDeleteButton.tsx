import * as React from 'react';
import {
    DialogManager,
    MUIDialogController
} from "../../../../../web/spectron0/material-ui/dialogs/MUIDialogController";
import IconButton from "@material-ui/core/IconButton";
import {ConfirmDialogProps} from "../../../../../web/js/ui/dialogs/ConfirmDialog";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
    readonly onDelete: () => void;
}

export const AnnotationDeleteButton = (props: IProps) => {

    const handleClick = (dialogs: DialogManager) => {

        const dialogProps: ConfirmDialogProps = {
            title: "Are you sure you want to delete this item? ",
            subtitle: "This is a permanent operation and can't be undone. ",
            type: "danger",
            onCancel: NULL_FUNCTION,
            onAccept: ()  => props.onDelete()
        };

        dialogs.confirm(dialogProps);

    };

    return (
        <MUIDialogController>

            {dialogs => (
                <IconButton onClick={() => handleClick(dialogs)}>
                    <DeleteIcon/>
                </IconButton>

            )}
        </MUIDialogController>
    );

};
