import React from "react";
import {deepMemo} from "../react/ReactUtils";
import grey from "@material-ui/core/colors/grey";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {MUITooltip} from "../mui/MUITooltip";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            marginLeft: theme.spacing(2)
        },
        key: {
            fontFamily: 'monospace',
            lineHeight: '16px',
            fontSize: '16px',
            padding: '3px',
            borderRadius: '2px',
            border: `1px solid ${theme.palette.divider}`,
            color: grey[900],
            backgroundColor: grey[200],
            margin: '2px',
            whiteSpace: 'nowrap',
            userSelect: 'none',
        },
    }),
);

interface IProps {
    readonly sequence: string;
}

export const KeySequence = deepMemo(function KeySequence(props: IProps) {

    const classes = useStyles();

    function toKeys() {

        let result = props.sequence;

        if (result === ' ') {
            result = 'space';
        }

        return result.split('+');

    }

    const keys = toKeys();

    // NOTE:
    //
    // using paper here doesn't work because it's paper on paper and elevations
    // don't work either really.

    return (
        <div className={classes.root}>
            {keys.map(current => <Key key={current} value={current}/>)}
        </div>
    );

});

interface KeyProps {
    readonly value: string;
}

interface InputAdvice {

    readonly keyChar: string;

    readonly description: string;

}

/**
 * An actual key on the keyboard.
 */
const Key = React.memo(function Key(props: KeyProps) {

    const classes = useStyles();

    function toValue(): InputAdvice {

        // http://xahlee.info/comp/unicode_computing_symbols.html

        switch (props.value) {

            case 'command':
                return {
                    keyChar: '⌘',
                    description: props.value
                };

            case 'ctrl':
                return {
                    keyChar: '^',
                    description: props.value
                };

            case 'shift':
                return {
                    keyChar: '⇧',
                    description: props.value
                };

            case 'ArrowLeft':

                return {
                    keyChar: '←',
                    description: 'left arrow'
                };

            case 'ArrowRight':
                return {
                    keyChar: '→',
                    description: 'right arrow'
                };

            case 'ArrowUp':
                return {
                    keyChar: '↑',
                    description: 'up arrow'
                };

            case 'ArrowDown':
                return {
                    keyChar: '↓',
                    description: 'down arrow'
                };

            default:
                return {
                    keyChar: props.value,
                    description: props.value
                };
        }

    }

    const value = toValue();

    // NOTE:
    //
    // using paper here doesn't work because it's paper on paper and elevations
    // don't work either really.

    return (
        <MUITooltip title={value.description}>
            <div className={classes.key}>
                {value.keyChar}
            </div>
        </MUITooltip>
    );

})
