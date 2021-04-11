import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Clipboards} from "../util/system/clipboard/Clipboards";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useBlocksStore } from './store/BlocksStore';
import { observer } from "mobx-react-lite"

export const NoteContextMenuItems = observer(function MUIDocDropdownMenuItems() {

    const store = useBlocksStore();

    const onCopyMarkdown = React.useCallback(() => {

        const active = store.active;

        if (! active) {
            return;
        }

        const activeNote = store.getBlock(active.id);

        if (! activeNote) {
            return;
        }

        const markdown = activeNote.content;

        Clipboards.writeText(markdown);

    }, [store]);

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
