import * as React from "react";
import clsx from "clsx";
import {deepMemo} from "../react/ReactUtils";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',

            "& > *": {
                marginLeft: '5px'
            },

            "& > *:first-child": {
                marginLeft: 0
            }

        },
    }),
);

interface IProps {
    readonly children: React.ReactNode;
    readonly style?: React.CSSProperties;
    readonly className?: string;
}

export const MUIGapBox = deepMemo(function MUIGapBox(props: IProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {props.children}
        </div>
    );
});
