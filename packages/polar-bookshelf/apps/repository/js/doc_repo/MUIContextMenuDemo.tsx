import React from 'react';

import {createContextMenu, useContextMenu} from "./MUIContextMenu";
import MenuItem from "@material-ui/core/MenuItem";

const ChildComponent = () => {

    const contextMenu = useContextMenu();

    return (
        <div {...contextMenu}>
            this is my child component
        </div>
    );

}

export const MUIContextMenuDemo = () => {

    // FIXME: JUST pass a div with menu items ?? that seems easier...

    const MyMenu = () => (
        <>
            <MenuItem>Profile</MenuItem>
            <MenuItem>home</MenuItem>
        </>
    );

    const MyContextMenu = createContextMenu(MyMenu);

    return (
        <MyContextMenu>
            <ChildComponent/>
        </MyContextMenu>
    );
}

