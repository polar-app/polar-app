import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDropdownMenu} from "../../../spectron0/material-ui/dropdown_menu/MUIDropdownMenu";
import {
    DialogManager,
    MUIDialogController
} from "../../../spectron0/material-ui/dialogs/MUIDialogController";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {ConfirmDialogProps} from "../../ui/dialogs/ConfirmDialog";
import {MUIDropdownItem} from "../../../spectron0/material-ui/dropdown_menu/MUIDropdownItem";
import DeleteIcon from "@material-ui/icons/Delete";


interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly onDelete: (comment: DocAnnotation) => void;
    readonly disabled?: boolean;
}

export const CommentDropdown = (props: IProps) => {

    const handleDelete = (dialogs: DialogManager) => {

        const confirmProps: ConfirmDialogProps = {
            title: "Are you sure you want to delete this comment? ",
            subtitle: 'This will permanently delete this comment.',
            type: 'error',
            onCancel: NULL_FUNCTION,
            onAccept: () => props.onDelete(props.comment)
        };

        dialogs.confirm(confirmProps);

    };

    return (

        <MUIDialogController>
            {(dialogs) => (

                <>

                    <MUIDropdownMenu id={props.id}
                                     button={{
                                         icon: <MoreVertIcon/>,
                                         disabled: props.disabled,
                                         size: 'small'
                                     }}
                                     placement='bottom-end'>

                        <div>
                            <MUIDropdownItem text="Delete"
                                             icon={<DeleteIcon/>}
                                             onClick={() => handleDelete(dialogs)}/>

                        </div>

                    </MUIDropdownMenu>

                </>
            )}
        </MUIDialogController>

    );

};

