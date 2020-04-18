import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import ArchiveIcon from "@material-ui/icons/Archive";
import FlagIcon from "@material-ui/icons/Flag";
import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import {Callback} from "polar-shared/src/util/Functions";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import grey from "@material-ui/core/colors/grey";


const activeColor = (active: boolean) => {
    const theme = useTheme();
    return active ? theme.palette.primary.main : theme.palette.text.secondary;
};

interface ButtonProps {
    readonly onClick: Callback;
    readonly size?: 'small' | 'medium' ;
}

interface ToggleButtonProps extends ButtonProps {
    readonly active?: boolean;
}

interface StandardButtonProps extends ButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
}

const StandardButton = (props: StandardButtonProps) => (
    <Tooltip title={props.tooltip} enterDelay={500}>
        <IconButton size={props.size || 'small'}
                    onClick={() => props.onClick()}
                    style={{color: grey[500]}}>
            {props.children}
        </IconButton>
    </Tooltip>
);


interface StandardToggleButtonProps extends ToggleButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
}

const StandardToggleButton = (props: StandardToggleButtonProps) => (
    <Tooltip title={props.tooltip} enterDelay={500}>
        <IconButton size={props.size || 'small'}
                    onClick={() => props.onClick()}
                    style={{color: activeColor(props.active || false)}}>
            {props.children}
        </IconButton>
    </Tooltip>
);

export const MUIDocTagButton = (props: ButtonProps) => (
    <StandardButton tooltip="Tag" {...props}>
        <LocalOfferIcon/>
    </StandardButton>
);

export const MUIDocArchiveButton = (props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Archive" {...props}>
        <ArchiveIcon/>
    </StandardToggleButton>
);

export const MUIDocFlagButton = (props: ToggleButtonProps) => (
    <StandardToggleButton tooltip="Flag" {...props}>
        <FlagIcon/>
    </StandardToggleButton>
);
