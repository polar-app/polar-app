import React from "react";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
    },
    label: {
        flexGrow: 1,
        flexShrink: 1,
        textAlign: 'left',
        justifyContent: 'flex-start',

        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

    },
    icon: {
    },
    iconButton: {
        height: '1.0rem',
        width: '1.0rem'
    },
}));

interface TabbedBrowserLabelProps {
    readonly label: React.ReactNode;
}

export const TabbedBrowserLabel = (props: TabbedBrowserLabelProps) => {

    const classes = useStyles();

    // return props.label;

    return (
        <div className={classes.root}>

            <Divider orientation="vertical"/>

            <div className={classes.label}>
                {props.label}
            </div>

            <div className={classes.icon}>
                <IconButton size="small">
                    <CloseIcon fontSize="small"/>
                </IconButton>
            </div>

        </div>
    );

}
