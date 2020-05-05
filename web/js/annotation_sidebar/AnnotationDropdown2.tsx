import * as React from 'react';
import {IDocAnnotation} from './DocAnnotation';
import {MUIMenu} from "../../spectron0/material-ui/dropdown_menu/MUIMenu";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIMenuItem} from "../../spectron0/material-ui/dropdown_menu/MUIMenuItem";
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';
import DeleteIcon from '@material-ui/icons/Delete';
import {useDialogManager} from "../../spectron0/material-ui/dialogs/MUIDialogControllers";
import {useAnnotationMutationContext} from "./AnnotationMutationContext";
import {useAnnotationActiveInputContext} from "./AnnotationActiveInputContext";

interface IProps {
    readonly id: string;
    readonly annotation: IDocAnnotation;
    readonly disabled?: boolean;
}

export const AnnotationDropdown2 = (props: IProps) => {

    const {annotation} = props;

    const dialogs = useDialogManager();

    const annotationActiveInput = useAnnotationActiveInputContext();
    const annotationMutation = useAnnotationMutationContext();

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
                                 onClick={annotationActiveInput.createComment}/>

                    <Divider/>

                    {/*FIXME: need jump to context*/}
                    {/*FIXME: migrate to MIUMenuDeleteIteon*/}
                    <MUIMenuItem text="Delete"
                                 icon={<DeleteIcon/>}
                                 onClick={() => annotationMutation.onDelete(annotation)}/>
                </div>
            </MUIMenu>

        </>

    );
};
