import React from "react";
import FlagIcon from "@material-ui/icons/Flag";
import {StandardToggleButton, ToggleButtonProps} from "./StandardToggleButton";

export const MUIDocFlagButton = React.memo((props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Flag" {...props}>
        <FlagIcon/>
    </StandardToggleButton>
));
