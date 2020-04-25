import {MUIMenuItem} from "../../../spectron0/material-ui/dropdown_menu/MUIMenuItem";
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react";
import {MUIDialogController} from "../../../spectron0/material-ui/dialogs/MUIDialogController";
import {MUIDeleteAction} from "../actions/MUIDeleteAction";
import {Callback} from "polar-shared/src/util/Functions";
import {ConfirmDialogProps} from "../../ui/dialogs/ConfirmDialog";

interface IProps {
    readonly onCancel?: Callback;
    readonly onAccept: Callback;
}

export const MUIDeleteMenuItem = (props: IProps) => {

    const confirmProps: ConfirmDialogProps = {
        title: "Are you sure you want to delete this item?",
        subtitle: "This is a permanent operation and can't be undone. ",
        type: 'error',
        ...props
    };

    const handleClick = MUIDeleteAction.create(confirmProps);

    return (
        <MUIDialogController>

            {dialogs => (

                <MUIMenuItem text="Delete"
                             icon={<DeleteIcon/>}
                             onClick={() => handleClick(dialogs)}/>

            )}
        </MUIDialogController>

    );
};
