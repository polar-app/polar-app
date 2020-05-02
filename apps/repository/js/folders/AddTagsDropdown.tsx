import * as React from 'react';
import {MUIMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenu";
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import {useFolderSidebarCallbacks} from '../folder_sidebar/FolderSidebarStore';

export const AddTagsDropdown = () => {

    const callbacks = useFolderSidebarCallbacks();

    return (

        <MUIMenu button={{
            icon: <AddIcon/>
        }}
                 placement="bottom-end">

            <div>

                <MUIMenuItem
                    onClick={() => callbacks.onCreateUserTag('folder')}
                    icon={<CreateNewFolderIcon/>}
                    text="Create Folder"/>


                <MUIMenuItem onClick={() => callbacks.onCreateUserTag('tag')}
                             icon={<LocalOfferIcon/>}
                             text="Create Tag"/>

            </div>

        </MUIMenu>

    );
};

