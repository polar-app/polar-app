import React from "react";
import {deepMemo} from "../react/ReactUtils";
import grey from "@material-ui/core/colors/grey";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontFamily: 'monospace',
            fontSize: '1.1em',
            padding: '5px',
            borderRadius: '2px',
            border: `1px solid ${grey[500]}`,
            backgroundColor: grey[200],
            color: grey[900],
            margin: '5px',
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
    const sequence = props.sequence.split('+').join( ' + ' );

    return (
        <div className={classes.root}>
            {sequence}
        </div>
    );

});
