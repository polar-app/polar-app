import {MUIMenuItem} from "../menu/MUIMenuItem";
import DeleteIcon from '@material-ui/icons/Delete';
import React from "react";
import {MUIDeleteAction} from "../actions/MUIDeleteAction";
import {Callback} from "polar-shared/src/util/Functions";
import {ConfirmDialogProps} from "../../ui/dialogs/ConfirmDialog";
import {useDialogManager} from "../dialogs/MUIDialogControllers";

interface IProps {
    readonly onClick: Callback;
}

export const MUIDeleteMenuItem = (props: IProps) => {

    // const confirmProps: ConfirmDialogProps = {
    //     title: "Are you sure you want to delete this item?",
    //     subtitle: "This is a permanent operation and can't be undone. ",
    //     type: 'error',
    //     ...props
    // };
    //
    // const handleClick = MUIDeleteAction.create(confirmProps);
    //
    // const dialogs = useDialogManager();
    //
    // return (
    //     <MUIMenuItem text="Delete"
    //                  icon={<DeleteIcon/>}
    //                  onClick={() => handleClick(dialogs)}/>
    //
    // );

    return (
        <MUIMenuItem text="Delete"
                     icon={<DeleteIcon/>}
                     onClick={props.onClick}/>

    );

};
