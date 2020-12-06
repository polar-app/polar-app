import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useNotesStore } from './NotesStore';
import {Clipboards} from "../util/system/clipboard/Clipboards";
import FileCopyIcon from '@material-ui/icons/FileCopy';

export const NoteContextMenuItems = React.memo(function MUIDocDropdownMenuItems() {

    const {active, index} = useNotesStore(['active', 'index']);

    const onCopyMarkdown = React.useCallback(() => {

        if (! active) {
            return;
        }

        const note = index[active];

        const markdown = note.content;

        Clipboards.getInstance().writeText(markdown);

    }, [active, index]);

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
