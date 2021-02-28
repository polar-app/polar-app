import React from 'react';

import {createContextMenu} from "./MUIContextMenu2";
import MenuItem from "@material-ui/core/MenuItem";

const ChildComponent = () => {

    const contextMenu = useMyContextMenu();

    return (
        <div {...contextMenu}>
            this is my child component
        </div>
    );

}

const MyMenu = () => (
    <>
        <MenuItem>Profile</MenuItem>
        <MenuItem>home</MenuItem>
    </>
);

const [MyContextMenu, useMyContextMenu] = createContextMenu(MyMenu, {name: 'mui-context-menu-demo'});

export const MUIContextMenuDemo = () => {

    // FIXME: JUST pass a div with menu items ?? that seems easier...

    return (
        <MyContextMenu>
            <ChildComponent/>
        </MyContextMenu>
    );
}

