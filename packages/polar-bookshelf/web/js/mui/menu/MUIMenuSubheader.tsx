import * as React from "react";
import {deepMemo} from "../../react/ReactUtils";
import ListSubheader from "@material-ui/core/ListSubheader";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

interface IProps {
    readonly children: React.ReactNode;
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            lineHeight: '2.2em'
        },
    }),
);

export const MUIMenuSubheader = deepMemo(function MUIMenuSubheader(props: IProps) {

    const classes = useStyles();

    return (
        <ListSubheader className={classes.root}>
            {props.children}
        </ListSubheader>
    );

})

