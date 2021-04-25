import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

interface IProps {
    readonly id?: string;
    readonly icon?: JSX.Element;
    readonly text: string;
    readonly children: React.ReactFragment;
}

export function MUISubMenu(props: IProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>

            <MenuItem id={props.id}
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onMouseOver={handleClick}>

                {props.icon &&
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>}

                <ListItemText primary={props.text} />

                <ArrowRightIcon/>
            </MenuItem>

            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                onClose={handleClose}>

                {props.children}

            </Menu>
        </div>
    );
}
