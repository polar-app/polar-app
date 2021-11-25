import {observer} from "mobx-react-lite";
import {useNotesRepoStore} from "./NotesRepoStore";
import React from "react";
import {IconButton} from "@material-ui/core";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.secondary
        },
        active: {
            color: theme.palette.secondary.main
        }
    }),
);

export const NotesRepoTableHeadCheck = observer(function NotesRepoTableHeadCheck() {

    const classes = useStyles();
    const notesRepoStore = useNotesRepoStore();
    const {view, selected} = notesRepoStore;

    const handleCheckbox = React.useCallback((checked: boolean) => {
        checked ? notesRepoStore.setSelected('all') : notesRepoStore.setSelected('none');
    }, [notesRepoStore]);

    const indeterminate = selected.length > 0 && selected.length < view.length;
    const checked = selected.length === view.length && view.length !== 0;

    const mode = indeterminate ? 'i' :  checked? 'c' : 'n';

    const className = mode === 'n' ? classes.root : classes.active;

    return (
        <IconButton className={className} onClick={() => handleCheckbox(mode === 'n')}>
            {mode === 'i' && <IndeterminateCheckBoxIcon/>}
            {mode === 'c' && <CheckBoxIcon/>}
            {mode === 'n' && <CheckBoxOutlineBlankIcon/>}
        </IconButton>
    );

});

