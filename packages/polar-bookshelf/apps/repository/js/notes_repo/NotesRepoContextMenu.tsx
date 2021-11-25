import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import LaunchIcon from '@material-ui/icons/Launch';

export const NotesRepoContextMenu = React.memo(function NotesRepoContextMenu() {

    return (
        <>
            <MenuItem onClick={NULL_FUNCTION}>
                <ListItemIcon>
                    <LaunchIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Open Note"/>
            </MenuItem>
        </>
    );
});
