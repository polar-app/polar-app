import React from "react";
import {Callback1} from "polar-shared/src/util/Functions";
import IconButton from "@material-ui/core/IconButton";
import useTheme from "@material-ui/core/styles/useTheme";
import {MUITooltip} from "../../../../../web/js/mui/MUITooltip";

function useActiveColor(active: boolean) {
    const theme = useTheme();
    return active ? theme.palette.primary.main : theme.palette.text.secondary;
}

export interface ButtonProps {
    readonly onClick: Callback1<React.MouseEvent>;
    readonly size?: 'small' | 'medium' ;
}

export interface ToggleButtonProps extends ButtonProps {
    readonly active?: boolean;
}

export interface StandardToggleButtonProps extends ToggleButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
}

export const StandardToggleButton = React.memo(function StandardToggleButton(props: StandardToggleButtonProps) {

    const activeColor = useActiveColor(props.active || false);

    return (
        <MUITooltip title={props.tooltip}>
            <IconButton size={props.size || 'small'}
                        onClick={props.onClick}
                        aria-label={props.tooltip}
                        style={{color: activeColor}}>
                {props.children}
            </IconButton>
        </MUITooltip>
    );

});
