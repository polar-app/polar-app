import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleIcon from '@material-ui/icons/Title';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
interface IProps {
    readonly onClose: () => void;
}

// NOTE that this CAN NOT be a functional component as it breaks MUI menu
// component.
export class MUIDocDropdownMenuItems extends React.Component<IProps> {

    public render() {

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
                        <TitleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Rename" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy Original URL" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <InsertDriveFileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Show File" />
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Copy File Path" />
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small" />
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
