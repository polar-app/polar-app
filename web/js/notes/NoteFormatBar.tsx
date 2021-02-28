import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { MUIButtonBar } from '../mui/MUIButtonBar';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    FABoldIcon,
    FAItalicIcon, FALinkIcon,
    FAQuoteLeftIcon,
    FAStrikethroughIcon,
    FASubscriptIcon, FASuperscriptIcon,
    FAUnderlineIcon
} from "../mui/MUIFontAwesome";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '6px',
        },
        button: {
            color: theme.palette.text.secondary,
            fontSize: '12px',
            marginLeft: '3px',
            marginRight: '3px',
        },
        icon: {
            fontSize: '22px',
            padding: '2px'
        }
    }));


interface FormatButtonProps {

    readonly children: JSX.Element;
    readonly onClick: () => void;

}

const FormatButton = (props: FormatButtonProps) => {

    const classes = useStyles();

    return (
        <IconButton size="small"
                    className={classes.button}>
            {props.children}
        </IconButton>
    );

}

export const NoteFormatBar = React.memo(() => {

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <MUIButtonBar>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FABoldIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FAItalicIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FAQuoteLeftIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FAUnderlineIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FAStrikethroughIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FASubscriptIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FASuperscriptIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={NULL_FUNCTION}>
                    <FALinkIcon className={classes.icon}/>
                </FormatButton>

            </MUIButtonBar>
        </Paper>
    );
})
