import React from 'react';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";

export function MUIHelpMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                // aria-controls="customized-menu"
                // aria-haspopup="true"
                // variant="contained"
                // color="default"
                onClick={handleClick}>
                <HelpIcon/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                style={{transformOrigin: 'center bottom' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={() => console.log('click')}>
                    <ListItemIcon>
                        <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sent mail" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <DraftsIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Drafts" />
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <InboxIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </MenuItem>
            </Menu>
        </div>
    );
}
