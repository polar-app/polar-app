import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';

interface IProps {
    readonly onClose: () => void;
}

export class MUIDocDropdownMenuItems extends React.Component<IProps> {
    render() {

        return (
            <>
                <MenuItem onClick={() => console.log('click')}>
                    <ListItemIcon>
                        <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Open Document" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy Original URL" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Show File" />
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy File Path" />
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy Document ID" />
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </>
        );
    }
}
