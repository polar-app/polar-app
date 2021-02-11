import React from 'react';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lighten, fade, darken, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {

    // border colors borrowed from here:
    //
    // https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/TableCell/TableCell.js

    const borderColor = theme.palette.type === 'light'
            ? lighten(fade(theme.palette.divider, 1), 0.88)
            : darken(fade(theme.palette.divider, 1), 0.68)

    // const borderColor = theme.palette.divider;

    return createStyles({

        borderTop: {
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
        },
        borderBottom: {
            borderBottom: `1px solid ${borderColor}`,
        },

    });

});

interface IProps {

    readonly id?: string;
    readonly className?: string;
    readonly style?: React.CSSProperties;

    readonly elevation?: number;

    readonly borderTop?: boolean;
    readonly borderBottom?: boolean;

    readonly padding?: number;

    // readonly borderLeft?: boolean;
    // readonly borderRight?: boolean;
    // readonly border?: boolean;

    readonly children?: JSX.Element | ReadonlyArray<JSX.Element>;

}

/**
 * A toolbar that looks like paper and has proper borders.
 */
export const MUIPaperToolbar = (props: IProps) => {

    // TODO: instead of CSS this could use Dividers as these use the right colors

    const classes = useStyles();

    const boxClasses = [
        props.borderTop ? classes.borderTop : undefined,
        props.borderBottom ? classes.borderBottom : undefined,
    ].filter(current => current !== undefined);

    // TODO do not use an internal Box and instead use direct CSS padding via CSS

    return (
        <Paper square
               id={props.id}
               style={props.style}
               className={props.className}
               elevation={props.elevation || 0}>

            <Box className={boxClasses.join(' ')}
                 padding={props.padding}>

                {props.children || null}

            </Box>
        </Paper>
    )
}
