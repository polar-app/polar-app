import React from 'react';
import Menu from '@material-ui/core/Menu';
import {MUIDocDropdownMenuItems} from './MUIDocDropdownMenuItems';

interface IProps {
    readonly anchorEl: HTMLElement;
    readonly onClose: () => void;
}

export const MUIDocDropdownMenu = (props: IProps) => {

    const {anchorEl} = props;

    return (
        <Menu
            id="doc-dropdown-menu"
            anchorEl={anchorEl}
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            open={Boolean(anchorEl)}
            onClose={() => props.onClose()}>

            <MUIDocDropdownMenuItems onClose={props.onClose}/>

        </Menu>
    );
};
