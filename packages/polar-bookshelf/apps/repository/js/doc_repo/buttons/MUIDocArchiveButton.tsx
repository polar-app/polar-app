import React from "react";
import ArchiveIcon from "@material-ui/icons/Archive";
import { ToggleButtonProps, StandardToggleButton } from "./StandardToggleButton";

export const MUIDocArchiveButton = React.memo((props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Archive" {...props}>
        <ArchiveIcon/>
    </StandardToggleButton>
));
