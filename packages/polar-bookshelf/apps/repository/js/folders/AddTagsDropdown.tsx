import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import Box from '@material-ui/core/Box';
import {IconWithColor} from "../../../../web/js/ui/IconWithColor";

interface IProps {
    readonly onCreateFolder: () => void;
    readonly onCreateTag: () => void;
}

export const AddTagsDropdown = deepMemo(function AddTagsDropdown(props: IProps) {

    return (

        <MUIMenu button={{
                    icon: (
                        <IconWithColor color="text.secondary" Component={AddIcon}/>
                    )
                 }}
                 placement="bottom-end">
            <div>

                <MUIMenuItem onClick={props.onCreateFolder}
                             icon={<CreateNewFolderIcon/>}
                             text="Create Folder"/>

                <MUIMenuItem onClick={props.onCreateTag}
                             icon={<LocalOfferIcon/>}
                             text="Create Tag"/>

            </div>

        </MUIMenu>

    );
});

