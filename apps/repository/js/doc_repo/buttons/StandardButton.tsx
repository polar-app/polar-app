import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import grey from "@material-ui/core/colors/grey";

export interface StandardButtonProps extends ButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
}

export const StandardButton = (props: StandardButtonProps) => (
    <Tooltip title={props.tooltip}>
        <IconButton size={props.size || 'small'}
                    onClick={props.onClick}
                    aria-label={props.tooltip.toLowerCase()}
                    style={{color: grey[500]}}>
            {props.children}
        </IconButton>
    </Tooltip>
);
