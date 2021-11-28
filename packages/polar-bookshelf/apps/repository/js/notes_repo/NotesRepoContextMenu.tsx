import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LaunchIcon from '@material-ui/icons/Launch';
import {observer} from "mobx-react-lite";
import DeleteIcon from "@material-ui/icons/Delete";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {useNoteLinkLoader} from "../../../../web/js/notes/NoteLinkLoader";

export const NotesRepoContextMenu = observer(function NotesRepoContextMenu() {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    const handleOpen = React.useCallback(() => {
        noteLinkLoader(selected)
    }, [tableGridStore, selected]);

    const handleDelete = React.useCallback(() => {
        blocksStore.deleteBlocks(selected);
    }, [blocksStore, selected]);

    return (
        <>
            {selected.length === 1 && (
                <MenuItem onClick={handleOpen}>
                    <ListItemIcon>
                        <LaunchIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Open Note"/>
                </MenuItem>
            )}

            {selected.length >= 1 && (
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Delete"/>
                </MenuItem>
            )}

        </>
    );
});
