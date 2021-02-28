import IconButton from '@material-ui/core/IconButton';
import React from 'react';
import { MUIButtonBar } from '../mui/MUIButtonBar';
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
            // color: theme.palette.text.secondary,
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
    readonly onClick?: () => void;

}

const FormatButton = (props: FormatButtonProps) => {

    const classes = useStyles();

    return (
        <IconButton size="small"
                    className={classes.button}
                    onClick={props.onClick}>
            {props.children}
        </IconButton>
    );

}

interface IProps {
    readonly onBold?: () => void;
    readonly onItalic?: () => void;
    readonly onQuote?: () => void;
    readonly onUnderline?: () => void;
    readonly onStrikethrough?: () => void;
    readonly onSubscript?: () => void;
    readonly onSuperscript?: () => void;
    readonly onLink?: () => void;
}

export const NoteFormatBar = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <MUIButtonBar>

                <FormatButton onClick={props.onBold}>
                    <FABoldIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onItalic}>
                    <FAItalicIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onQuote}>
                    <FAQuoteLeftIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onUnderline}>
                    <FAUnderlineIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onStrikethrough}>
                    <FAStrikethroughIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onSubscript}>
                    <FASubscriptIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onSuperscript}>
                    <FASuperscriptIcon className={classes.icon}/>
                </FormatButton>

                <FormatButton onClick={props.onLink}>
                    <FALinkIcon className={classes.icon}/>
                </FormatButton>

            </MUIButtonBar>
        </Paper>
    );
})
