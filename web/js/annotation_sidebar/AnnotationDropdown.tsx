import * as React from 'react';
import {DocAnnotation} from './DocAnnotation';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {MUIMenu} from "../../spectron0/material-ui/dropdown_menu/MUIMenu";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIMenuItem} from "../../spectron0/material-ui/dropdown_menu/MUIMenuItem";
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import {ConfirmDialogProps} from '../ui/dialogs/ConfirmDialog';
import {useDialogManager} from "../../spectron0/material-ui/dialogs/MUIDialogControllers";

interface IProps {
    readonly id: string;
    readonly annotation: DocAnnotation;
    readonly onDelete: (annotation: DocAnnotation) => void;
    readonly onJumpToContext: (annotation: DocAnnotation) => void;
    readonly onCreateComment: (annotation: DocAnnotation) => void;
    readonly onCreateFlashcard: (annotation: DocAnnotation) => void;
    readonly disabled?: boolean;
}

export const AnnotationDropdown = (props: IProps) => {

    const dialogs = useDialogManager();

    const handleDelete = React.useCallback(() => {

        const confirmProps: ConfirmDialogProps = {
            title: "Are you sure you want to delete this annotation? ",
            subtitle: "This will also delete all associated comments and flashcards.",
            type: 'danger',
            onCancel: NULL_FUNCTION,
            onAccept: () => props.onDelete(props.annotation)
        };

        dialogs.confirm(confirmProps);

    }, [dialogs]);

    return (

        <>
            {/*FIXME: move to MUIMenuIconButton*/}
            <MUIMenu button={{
                         icon: <MoreVertIcon/>,
                         disabled: props.disabled,
                         size: 'small'
                     }}
                     placement='bottom-end'>
                <div>

                    {/*TODO: for now don't create the same items as the toolbar */}

                    <MUIMenuItem text="Create comment"
                                 icon={<CommentIcon/>}
                                 onClick={() => props.onCreateComment(props.annotation)}/>

                    <Divider/>

                    {/*FIXME: need jump to context*/}
                    {/*FIXME: migrate to MIUMenuDeleteIteon*/}
                    <MUIMenuItem text="Delete"
                                 icon={<DeleteIcon/>}
                                 onClick={() => handleDelete()}/>
                </div>
            </MUIMenu>

        </>

    );
};
