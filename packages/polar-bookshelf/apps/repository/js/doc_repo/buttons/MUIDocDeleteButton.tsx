import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {StandardButton} from "./StandardButton";

export const MUIDocDeleteButton = React.memo((props: ButtonProps) => (
    <StandardButton tooltip="Delete" {...props}>
        <DeleteIcon />
    </StandardButton>
));
