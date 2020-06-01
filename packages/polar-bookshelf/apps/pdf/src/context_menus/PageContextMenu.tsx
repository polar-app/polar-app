import * as React from 'react';
import {DropdownMenu, MenuItem} from "@burtonator/react-dropdown";
import {ContextMenu} from '../../../../web/js/ui/context_menu/ContextMenu';

interface IProps {
    readonly id: string;
}

export function PageContextMenu(props: IProps) {

    return (

        <ContextMenu id={props.id}>

            <DropdownMenu>

                <MenuItem
                    // onSelect={() => ContextMenuMessages.postContextMenuMessage("create-pagemark-to-point", triggerEvent)}
                >

                    Create Pagemark to Point

                </MenuItem>

                <MenuItem
                    // onSelect={() => ContextMenuMessages.postContextMenuMessage("create-area-highlight", triggerEvent)}
                >

                    Create Area Highlight

                </MenuItem>

            </DropdownMenu>

        </ContextMenu>
    );

}
