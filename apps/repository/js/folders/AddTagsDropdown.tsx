import * as React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown} from "reactstrap";
import {FolderIcon, PlusIcon, TagIcon} from "../../../../web/js/ui/icons/FixedWidthIcons";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CreateUserTagCallback} from "./FolderContextMenus";
import {MUIMenu} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenu";
import AddIcon from '@material-ui/icons/Add';
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SendIcon from "@material-ui/icons/Send";
import ListItemText from "@material-ui/core/ListItemText";
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {MUIMenuItem} from "../../../../web/spectron0/material-ui/dropdown_menu/MUIMenuItem";

export class AddTagsDropdown extends React.Component<IProps, IState> {


    constructor(props: IProps, context: any) {
        super(props, context);

    }

    public render() {

        return (

            <MUIMenu button={{
                                icon: <AddIcon/>
                             }}
                     placement="bottom-end">

                <div>

                    <MUIMenuItem onClick={() => this.props.createUserTagCallback('folder')}
                                 icon={<CreateNewFolderIcon />}
                                 text="Create Folder"/>


                    <MUIMenuItem onClick={() => this.props.createUserTagCallback('tag')}
                                 icon={<LocalOfferIcon />}
                                 text="Create Tag"/>

                </div>

            </MUIMenu>

        );
    }

}

export interface IProps {
    readonly createUserTagCallback: CreateUserTagCallback;
}

export interface IState {
}


