import React from 'react';
import Menu from '@material-ui/core/Menu';
import {MUIDocDropdownMenuItems} from './MUIDocDropdownMenuItems';
import {Callback} from "polar-shared/src/util/Functions";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {useContextMenuHook} from "../../../../web/js/mui/hooks/useContextMenuHook";

interface IProps {
    readonly anchorEl: HTMLElement;
    readonly onClose: Callback;
}

export const DocRepoDropdownMenu = deepMemo(function DocRepoDropdownMenu(props: IProps) {
    const {anchorEl} = props;

    const handleCloseFromHook = useContextMenuHook(props.onClose);
    
    return (
        <Menu
            id="doc-dropdown-menu"
            anchorEl={anchorEl}
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            transformOrigin={{vertical: "top", horizontal: "center"}}
            open={Boolean(anchorEl)}
            onClose={() => handleCloseFromHook()}>

            <MUIDocDropdownMenuItems/>

        </Menu>
    );
});
