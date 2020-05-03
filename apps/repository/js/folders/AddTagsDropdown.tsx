import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";
import {MUIPopper} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIPopper";
import isEqual from "react-fast-compare";
import Menu from '@material-ui/core/Menu';

interface IProps {
    readonly onCreateFolder: () => void;
    readonly onCreateTag: () => void;
}

export const AddTagsDropdown = React.memo((props: IProps) => {

    return (

        <div>
            <MUIPopper icon={<AddIcon/>}
                       placement="bottom-end">

                <div>

                    <MUIMenuItem onClick={props.onCreateFolder}
                                 icon={<CreateNewFolderIcon/>}
                                 text="Create Folder"/>

                    <MUIMenuItem onClick={props.onCreateTag}
                                 icon={<LocalOfferIcon/>}
                                 text="Create Tag"/>

                </div>

            </MUIPopper>
        </div>

    );
}, isEqual);

