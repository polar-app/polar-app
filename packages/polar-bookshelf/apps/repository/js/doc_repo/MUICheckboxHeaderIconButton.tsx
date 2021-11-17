import React from "react";

import { IconButton } from "@material-ui/core";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { useDocRepoCallbacks, useDocRepoStore } from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
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

export const MUICheckboxHeaderIconButton = React.memo(function MUICheckboxHeaderIconButton() {
    
    const classes = useStyles();
    const {view, selected} = useDocRepoStore(['view', 'selected']);
    const callbacks = useDocRepoCallbacks();
    const {setSelected} = callbacks;

    const handleCheckbox = React.useCallback((checked: boolean) => {
        checked ? setSelected('all') : setSelected('none');
    }, [setSelected]);

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

