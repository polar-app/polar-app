import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 400,
        },
        input: {
            margin: theme.spacing(1),
            flex: 1,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

interface IProps {
    readonly size?: 'small' | 'medium';
    readonly placeholder?: string;
    readonly style?: React.CSSProperties;
    readonly onChange: (text: string) => void;
}

export default function SearchBox(props: IProps) {

    const size = props.size || 'medium';

    const classes = useStyles();

    const [text, setText] = useState("");
    const [active, setActive] = useState(false);

    const handleChange = (text: string) => {
        setText(text);
        props.onChange(text);
    };

    return (
        <Paper component="form"
               style={props.style || {}}
               className={classes.root}>
            <SearchIcon />

            <InputBase
                className={classes.input}
                placeholder={props.placeholder}
                value={text}
                onChange={event => handleChange(event.currentTarget.value)}
                inputProps={{ 'aria-label': 'search google maps' }}
            />
            {text !== '' &&
                <IconButton size={size}
                            onClick={() => handleChange("")}
                            aria-label="clear">
                    <CloseIcon />
                </IconButton>}
        </Paper>
    );
}
