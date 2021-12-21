import React from "react";
import {ButtonProps} from "./StandardToggleButton";
import IconButton from "@material-ui/core/IconButton";
import {MUITooltip} from "../../../../../web/js/mui/MUITooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary
        },
    }),
);

export interface StandardButtonProps extends ButtonProps {
    readonly tooltip: string;
    readonly children: JSX.Element;
    readonly disabled?: boolean;
    readonly style?: React.CSSProperties;
}

export const StandardIconButton = React.memo(React.forwardRef((props: StandardButtonProps, ref) => {
    const classes = useStyles();

    return (
        <MUITooltip title={props.tooltip}>
            <IconButton size={props.size || 'small'}
                        className={classes.root}
                        style={props.style || {}}
                        disableRipple={true}
                        onClick={props.onClick}
                        disabled={props.disabled}
                        aria-label={props.tooltip.toLowerCase()}>

                {props.children}

            </IconButton>
        </MUITooltip>
    );
}));
