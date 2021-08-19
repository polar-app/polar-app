import {createStyles, makeStyles} from "@material-ui/core";
import React from "react";
import {ColorStr} from "../ui/colors/ColorSelectorBox";

interface IProps {
    color?: ColorStr;
}

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'stretch',
        },
        color: {
            marginRight: 8,
            flexGrow: 0,
            width: 4,
            borderRadius: 2,
            flex: '0 0 4px',
        },
    }),
);

export const BlockAnnotationContentWrapper: React.FC<IProps> = ({ color, children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.color} style={{ backgroundColor: color }} />
            <div children={children} />
        </div>
    );
};
