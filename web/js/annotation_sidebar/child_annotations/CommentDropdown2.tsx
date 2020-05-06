import * as React from 'react';
import {IDocAnnotation} from '../DocAnnotation';
import {MUIMenu} from "../../../spectron0/material-ui/dropdown_menu/MUIMenu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIMenuItem} from "../../../spectron0/material-ui/dropdown_menu/MUIMenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import isEqual from "react-fast-compare";
import {
    IDeleteMutation,
    useAnnotationMutationsContext
} from "../AnnotationMutationsContext";


interface IProps {
    readonly id: string;
    readonly comment: IDocAnnotation;
    readonly onDelete: () => void;
    readonly disabled?: boolean;
}

export const CommentDropdown2 = React.memo((props: IProps) => {

    const annotationMutations = useAnnotationMutationsContext();

    const handleDelete = () => {

        const mutation: IDeleteMutation = {
            selected: [props.comment]
        };

        annotationMutations.onDeleted(mutation);
    }

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
                                 onClick={handleDelete}/>

                </div>

            </MUIMenu>

        </>

    );

}, isEqual);

