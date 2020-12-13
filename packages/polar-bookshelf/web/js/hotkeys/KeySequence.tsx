import React from "react";
import {deepMemo} from "../react/ReactUtils";
import grey from "@material-ui/core/colors/grey";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontFamily: 'monospace',
            fontSize: '1.0em',
            padding: '2px',
            borderRadius: '2px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            // color: theme.palette.,
            margin: '2px',
            whiteSpace: 'nowrap',
            userSelect: 'none'
        },
    }),
);

interface IProps {
    readonly sequence: string;
}

export const KeySequence = deepMemo((props: IProps) => {

    const classes = useStyles();

    function prettyPrintSequence() {

        let result = props.sequence;

        if (result === ' ') {
            result = 'space';
        }

        return result.split('+').join( ' + ' );

    }

    const sequence = prettyPrintSequence();

    return (
        <div className={classes.root}>
            {sequence}
        </div>
    );

});
