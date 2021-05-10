import React from "react";
import Crop54Icon from '@material-ui/icons/Crop54';
import { ToggleButtonProps, StandardToggleButton } from "./StandardToggleButton";

export const MUIDocAreaHighlightModeToggle = React.memo((props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Area highlight mode" {...props}>
        <Crop54Icon/>
    </StandardToggleButton>
));
