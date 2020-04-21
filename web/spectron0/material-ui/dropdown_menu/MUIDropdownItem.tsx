import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import * as React from "react";

interface IProps {
    readonly icon?: JSX.Element;
    readonly text: string;
    readonly onClick: () => void;
}

export const MUIDropdownItem = (props: IProps) => (
    <MenuItem onClick={() => props.onClick()}>

        {props.icon &&
            <ListItemIcon>
                {props.icon}
            </ListItemIcon>}

        <ListItemText primary={props.text} />

    </MenuItem>

);
