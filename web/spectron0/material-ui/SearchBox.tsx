import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import Box from "@material-ui/core/Box";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            // border: `1px solid ${theme.palette.info.main}`
        },
        input: {
            // margin: theme.spacing(1),
            flex: 1,
        },
        searchIcon: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },

        closeIcon: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },

    }),
);

interface IProps {
    readonly placeholder?: string;
    readonly style?: React.CSSProperties;
    readonly onChange: (text: string) => void;
}

export default function SearchBox(props: IProps) {

    const classes = useStyles();

    const [text, setText] = useState("");
    const [active, setActive] = useState(false);

    const handleChange = (text: string) => {
        setText(text);
        props.onChange(text);
    };

    return (

        <ClickAwayListener onClickAway={() => setActive(false)}>
            <Paper component="form"
                   onClick={() => setActive(true)}
                   elevation={active ? 1 : 0}
                   style={props.style || {}}
                   className={classes.root}>

                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>

                {/*FIXME: this is a weird bug here... it uses position relative and*/}
                {/*that causes the UI to break.*/}

                <InputBase
                    className={classes.input}
                    placeholder={props.placeholder}
                    value={text}
                    onChange={event => handleChange(event.currentTarget.value)}
                    inputProps={{ 'aria-label': props.placeholder }}
                />

                {text !== '' &&
                    <IconButton size={'medium'}
                                className={classes.closeIcon}
                                onClick={() => handleChange("")}
                                aria-label="clear">
                        <CloseIcon/>
                    </IconButton>}

            </Paper>
        </ClickAwayListener>
    );
}
