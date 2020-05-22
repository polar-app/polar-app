import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {MUIMenuItem} from "../../../../web/js/mui/menu/MUIMenuItem";
import isEqual from "react-fast-compare";
import {MUIMenu} from "../../../../web/js/mui/menu/MUIMenu";

interface IProps {
    readonly onCreateFolder: () => void;
    readonly onCreateTag: () => void;
}

export const AddTagsDropdown = React.memo((props: IProps) => {

    return (

        <div>
            <MUIMenu button={{
                        icon: <AddIcon/>
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
        </div>

    );
}, isEqual);

