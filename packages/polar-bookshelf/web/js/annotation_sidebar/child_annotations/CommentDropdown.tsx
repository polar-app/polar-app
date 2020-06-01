import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIMenu} from "../../mui/menu/MUIMenu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {ConfirmDialogProps} from "../../ui/dialogs/ConfirmDialog";
import {MUIMenuItem} from "../../mui/menu/MUIMenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDialogManager} from "../../mui/dialogs/MUIDialogControllers";


interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly onDelete: (comment: DocAnnotation) => void;
    readonly disabled?: boolean;
}

export const CommentDropdown = (props: IProps) => {

    const dialogs = useDialogManager();

    const handleDelete = React.useCallback(() => {

        const confirmProps: ConfirmDialogProps = {
            title: "Are you sure you want to delete this comment? ",
            subtitle: 'This will permanently delete this comment.',
            type: 'error',
            onCancel: NULL_FUNCTION,
            onAccept: () => props.onDelete(props.comment)
        };

        dialogs.confirm(confirmProps);

    }, [dialogs]);

    return (

        <>

            <MUIMenu id={props.id}
                     button={{
                         icon: <MoreVertIcon/>,
                         disabled: props.disabled,
                         size: 'small'
                     }}
                     placement='bottom-end'>

                <div>
                    <MUIMenuItem text="Delete"
                                 icon={<DeleteIcon/>}
                                 onClick={() => handleDelete()}/>

                </div>

            </MUIMenu>

        </>

    );

};

