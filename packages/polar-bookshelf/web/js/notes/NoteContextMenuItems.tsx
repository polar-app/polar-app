import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useNotesStore, useNotesStoreCallbacks } from './NotesStore';
import {Clipboards} from "../util/system/clipboard/Clipboards";
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const NoteContextMenuItems = React.memo(function MUIDocDropdownMenuItems() {

    const {getActive} = useNotesStoreCallbacks();

    const onCopyMarkdown = React.useCallback(() => {

        const activeNote = getActive();

        if (! activeNote) {
            return;
        }

        const markdown = activeNote.content;

        Clipboards.getInstance().writeText(markdown);

    }, [getActive]);

    return (
        <>

            <MenuItem onClick={onCopyMarkdown}>
                <ListItemIcon>
                    <FileCopyIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Copy Markdown"/>
            </MenuItem>

        </>
    );
});
