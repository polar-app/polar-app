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
import FormatClearIcon from '@material-ui/icons/FormatClear';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import { URLStr } from 'polar-shared/src/util/Strings';

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
    readonly onClick?: (event: React.MouseEvent) => void;

}

const FormatButton = (props: FormatButtonProps) => {

    const classes = useStyles();

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (props.onClick) {
            props.onClick(event);
        }
    }, [props]);

    const abortEvent = React.useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }, []);


    return (
        <IconButton size="small"
                    className={classes.button}
                    onMouseDown={abortEvent}
                    onMouseUp={abortEvent}
                    onClick={handleClick}>
            {props.children}
        </IconButton>
    );

}

interface LinkBarProps {
    readonly onDispose?: () => void;
    readonly onLink?: (url: URLStr) => void;
}

const LinkBar = (props: LinkBarProps) => {

    const valueRef = React.useRef("");

    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        valueRef.current = event.currentTarget.value;
        event.stopPropagation();
        event.preventDefault();
    }, []);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        event.stopPropagation();
    }, []);

    const handleCreateLink = React.useCallback(() => {

        if (! valueRef.current.startsWith('http:') && ! valueRef.current.startsWith('https:')) {
            return;
        }

        if (props.onLink) {
            props.onLink(valueRef.current);
        }

        if (props.onDispose) {
            props.onDispose();
        }

    }, [props]);

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (event.key === 'Enter') {
            handleCreateLink();
        }

        if (event.key === 'Escape') {

            if (props.onDispose) {
                props.onDispose();
            }
        }

        event.stopPropagation();

    }, [handleCreateLink, props]);

    const handleClick = React.useCallback((event: React.MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
    }, []);

    // FIXME: hover says "please fill out this field"

    return (
        <>
            <TextField required
                       // variant="outlined"
                       autoFocus={true}
                       placeholder="https://example.com"
                       // InputProps={{
                       //     style: {padding: '35px'}
                       // }}
                       style={{
                           fontSize: '14px',
                           minWidth: '35ch'
                       }}
                       helperText=""
                       onKeyDown={handleKeyDown}
                       onKeyUp={handleKeyUp}
                       onClick={handleClick}
                       onMouseDown={handleClick}
                       onMouseUp={handleClick}
                       onChange={event => handleChange(event)}/>

            <FormatButton onClick={handleCreateLink}>
                <CheckIcon style={{color: 'green'}}/>
            </FormatButton>

        </>
    );
}

interface NoteFormatBarInnerProps {

    readonly onBold?: () => void;
    readonly onItalic?: () => void;
    readonly onQuote?: () => void;
    readonly onUnderline?: () => void;
    readonly onStrikethrough?: () => void;
    readonly onSubscript?: () => void;
    readonly onSuperscript?: () => void;
    readonly onLink?: (event: React.MouseEvent) => void;
    readonly onRemoveFormat?: () => void;
    readonly onDispose?: () => void;

}

const NoteFormatBarInner = (props: NoteFormatBarInnerProps) => {

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

            <FormatButton onClick={props.onRemoveFormat}>
                <FormatClearIcon className={classes.icon}/>
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
    readonly onLink?: (url: URLStr) => void;
    readonly onRemoveFormat?: () => void;

    /**
     * Called when the bar should be removed/disposed.
     */
    readonly onDispose?: () => void;


}

export const NoteFormatBar = React.memo(function NoteFormatBar(props: NoteFormatBarProps) {

    const classes = useStyles();

    const [mode, setMode] = React.useState<'link' | 'format'>('format');

    const changeToLinkMode = React.useCallback((event: React.MouseEvent) => {

        event.preventDefault();
        event.stopPropagation();

        // FIXME: as soon as I setMode here, we lose the region...
        setMode('link')

    }, []);

    const handleMouseEvent = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <Paper className={classes.root}>
            <MUIButtonBar onMouseDown={handleMouseEvent}
                          onMouseUp={handleMouseEvent}>

                {mode === 'format' && (
                    <NoteFormatBarInner {...props} onLink={changeToLinkMode}/>
                )}

                {mode === 'link' && (
                    <LinkBar onDispose={props.onDispose} onLink={props.onLink}/>
                )}

            </MUIButtonBar>
        </Paper>
    );
})
