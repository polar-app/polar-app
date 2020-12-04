import React from "react";
import {MiddleDot} from "./MiddleDot";
import {NoteTargetStr, useNoteLinkLoader} from "./NoteLinkLoader";
import IconButton from "@material-ui/core/IconButton";
import {deepMemo} from "../react/ReactUtils";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useNotesStore} from "./NotesStore";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint,
            width: '1em',
            height: '1em'
        },
    }),
);
interface IProps {
    readonly target: NoteTargetStr;
}

export const NoteOverflow = deepMemo(function NoteOverflow(props: IProps) {

    const {active} = useNotesStore(['active']);
    const classes = useStyles();

    const className=clsx(classes.root, 'NoteOverflow');

    if (active !== props.target) {
        return <div className={className}/>;
    }

    return (
        <IconButton className={className}
                    onClick={NULL_FUNCTION}
                    size="small">
            <MoreVertIcon/>
        </IconButton>
    );
})

