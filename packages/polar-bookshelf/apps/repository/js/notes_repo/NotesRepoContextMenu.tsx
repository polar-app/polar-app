import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LaunchIcon from '@material-ui/icons/Launch';
import {observer} from "mobx-react-lite";
import DeleteIcon from "@material-ui/icons/Delete";
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {useTableGridStore} from './NotesRepoTable2';

export const NotesRepoContextMenu = observer(function NotesRepoContextMenu() {

    const tableGridStore = useTableGridStore();
    const blocksStore = useBlocksStore();

    const {selected} = tableGridStore;

    const handleOpen = React.useCallback(() => {
        tableGridStore.onOpen(selected[0]);
    }, [tableGridStore, selected]);

    const handleDelete = React.useCallback(() => {
        blocksStore.deleteBlocks(selected);
        tableGridStore.setSelected('none');
    }, [blocksStore, selected, tableGridStore]);

    return (
        <>
            <MenuItem onClick={handleOpen}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Open Note"/>
            </MenuItem>

            <MenuItem onClick={handleDelete}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Delete"/>
            </MenuItem>

        </>
    );
});
