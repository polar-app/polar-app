import React from "react";
import {IDStr} from "polar-shared/src/util/Strings";
import {NoteButton} from "./NoteButton";
import {ArrowDown} from "./ArrowDown";
import {ArrowRight} from "./ArrowRight";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import { useNotesStore } from "./store/NotesStore";
import { observer } from "mobx-react-lite"

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

export const NoteExpandToggleButton = observer(function NoteExpandToggleButton(props: IProps) {

    const {id} = props;

    const classes = useStyles();

    const store = useNotesStore();

    const expanded = store.isExpanded(props.id);

    return (
        <NoteButton className={classes.root}
                    onClick={() => store.toggleExpand(id)}>
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