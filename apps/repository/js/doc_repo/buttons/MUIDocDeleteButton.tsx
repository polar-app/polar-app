import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {StandardIconButton} from "./StandardIconButton";

export const MUIDocDeleteButton = React.memo((props: ButtonProps) => (
    <StandardIconButton tooltip="Delete" {...props}>
        <DeleteIcon />
    </StandardIconButton>
));
