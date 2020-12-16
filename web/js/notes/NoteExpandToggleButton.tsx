import React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {useNoteExpanded, useNotesStore, useNotesStoreCallbacks} from "./NotesStore";
import {NoteButton} from "./NoteButton";
import {ArrowDown} from "./ArrowDown";
import {ArrowRight} from "./ArrowRight";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint
        },
    }),
);

interface IProps {
    readonly id: IDStr;
}

export const NoteExpandToggleButton = React.memo(function NoteExpandToggleButton(props: IProps) {

    const {id} = props;

    const classes = useStyles();
    const {toggleExpand} = useNotesStoreCallbacks();

    const expanded = useNoteExpanded(props.id);

    return (
        <NoteButton className={classes.root}
                    onClick={() => toggleExpand(id)}>
            <>
                {expanded && (
                    <ArrowDown/>
                )}
                {! expanded && (
                    <ArrowRight/>
                )}
            </>
        </NoteButton>
    );

});