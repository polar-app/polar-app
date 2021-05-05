import * as React from 'react';
import {IDocAnnotationRef} from '../DocAnnotation';
import {MUIMenu} from "../../mui/menu/MUIMenu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIMenuItem} from "../../mui/menu/MUIMenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import isEqual from "react-fast-compare";
import {useAnnotationMutationsContext} from "../AnnotationMutationsContext";
import Tooltip from '@material-ui/core/Tooltip';


interface IProps {
    readonly id: string;
    readonly comment: IDocAnnotationRef;
    readonly onDelete: () => void;
    readonly disabled?: boolean;
}

export const CommentDropdown2 = React.memo((props: IProps) => {

    const annotationMutations = useAnnotationMutationsContext();
    const {comment} = props;

    const handleDelete = annotationMutations.createDeletedCallback({selected: [comment]});

    return (

        // <Tooltip title="More comment options...">

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

        // </Tooltip>

    );

}, isEqual);

