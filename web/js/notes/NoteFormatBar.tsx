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
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            padding: '6px',
        },
        button: {
            // color: theme.palette.text.secondary,
            fontSize: '12px',
            marginLeft: '5px',
            marginRight: '5px',
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

const LinkBar = () => {

    const ref = React.useRef("");

    return (
        <>
            <TextField required
                       autoFocus={true}
                       placeholder="https://example.com"
                       onChange={event => ref.current = event.currentTarget.value}/>

            {/*<FormatButton*/}
        </>
    );
}

const NoteFormatBarInner = (props: NoteFormatBarProps) => {

    const classes = useStyles();

    return (
        <>

            <FormatButton onClick={props.onBold}>
                <FABoldIcon className={classes.icon}/>
            </FormatButton>

            <FormatButton onClick={props.onItalic}>
                <FAItalicIcon className={classes.icon}/>
            </FormatButton>

            {/*<FormatButton onClick={props.onQuote}>*/}
            {/*    <FAQuoteLeftIcon className={classes.icon}/>*/}
            {/*</FormatButton>*/}

            {/*<FormatButton onClick={props.onUnderline}>*/}
            {/*    <FAUnderlineIcon className={classes.icon}/>*/}
            {/*</FormatButton>*/}

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

        </>
    );
}

export interface NoteFormatBarProps {
    readonly onBold?: () => void;
    readonly onItalic?: () => void;
    readonly onQuote?: () => void;
    readonly onUnderline?: () => void;
    readonly onStrikethrough?: () => void;
    readonly onSubscript?: () => void;
    readonly onSuperscript?: () => void;
    readonly onLink?: () => void;
}

export const NoteFormatBar = React.memo((props: NoteFormatBarProps) => {

    const classes = useStyles();

    const [mode, setMode] = React.useState<'link' | 'format'>('format');

    console.log("FIXME: mode: ", mode);

    return (
        <Paper className={classes.root}>
            <MUIButtonBar>

                {mode === 'format' && (
                    <NoteFormatBarInner {...props} onLink={() => setMode('link')}/>
                )}

                {mode === 'link' && (
                    <LinkBar/>
                )}

            </MUIButtonBar>
        </Paper>
    );
})
