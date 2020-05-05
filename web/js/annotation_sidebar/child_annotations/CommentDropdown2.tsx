import * as React from 'react';
import {DocAnnotation} from '../DocAnnotation';
import {MUIMenu} from "../../../spectron0/material-ui/dropdown_menu/MUIMenu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {MUIMenuItem} from "../../../spectron0/material-ui/dropdown_menu/MUIMenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import isEqual from "react-fast-compare";


interface IProps {
    readonly id: string;
    readonly comment: DocAnnotation;
    readonly onDelete: () => void;
    readonly disabled?: boolean;
}

export const CommentDropdown2 = React.memo((props: IProps) => {

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
                                 onClick={props.onDelete}/>

                </div>

            </MUIMenu>

        </>

    );

}, isEqual);

