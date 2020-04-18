import React from 'react';
import Menu from '@material-ui/core/Menu';
import {
    DocContextMenuCallbacks,
    MUIDocDropdownMenuItems
} from './MUIDocDropdownMenuItems';
import {Callback} from "polar-shared/src/util/Functions";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";

interface IProps extends DocContextMenuCallbacks {
    readonly selectedProvider: () => ReadonlyArray<RepoDocInfo>;
    readonly anchorEl: HTMLElement;
    readonly onClose: Callback;
}

export class MUIDocDropdownMenu extends React.Component<IProps> {
    public render() {

        const {anchorEl} = this.props;

        return (
            <Menu
                id="doc-dropdown-menu"
                anchorEl={anchorEl}
                keepMounted
                getContentAnchorEl={null}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                transformOrigin={{vertical: "top", horizontal: "center"}}
                open={Boolean(anchorEl)}
                onClose={() => this.props.onClose()}>

                <MUIDocDropdownMenuItems {...this.props}/>

            </Menu>
        );
    }
}
