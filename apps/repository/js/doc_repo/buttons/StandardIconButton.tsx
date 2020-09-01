import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";

export interface StandardButtonProps extends ButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
    readonly disabled?: boolean;
}

export const StandardIconButton = (props: StandardButtonProps) => {
    const theme = useTheme();

    return (
        <Tooltip title={props.tooltip}>
            <IconButton size={props.size || 'small'}
                        onClick={props.onClick}
                        disabled={props.disabled}
                        aria-label={props.tooltip.toLowerCase()}
                        style={{color: theme.palette.text.secondary}}>
                {props.children}
            </IconButton>
        </Tooltip>
    );
};
