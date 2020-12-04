import React from "react";
import {NoteTargetStr} from "./NoteLinkLoader";
import IconButton from "@material-ui/core/IconButton";
import {deepMemo} from "../react/ReactUtils";
import {useNotesStore} from "./NotesStore";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import {useNoteContextMenu} from "./Note";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint,
            width: '28px',
            height: '1em'
        },
        icon: {
            fontSize: '0.8em'
        }
    }),
);
interface IProps {
    readonly target: NoteTargetStr;
}

export const NoteOverflow = deepMemo(function NoteOverflow(props: IProps) {

    const {active} = useNotesStore(['active']);
    const classes = useStyles();
    const contextMenuHandlers = useNoteContextMenu();

    const className=clsx(classes.root, 'NoteOverflow');

    if (active !== props.target) {
        return <div className={className}/>;
    }

    return (
        <IconButton className={className}
                    onClick={event => contextMenuHandlers.onContextMenu(event)}
                    size="small">

            <MoreVertIcon className={classes.icon}/>

        </IconButton>
    );
})

