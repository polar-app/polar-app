import React from 'react';
import Menu from '@material-ui/core/Menu';
import {MUIDocDropdownMenuItems} from './MUIDocDropdownMenuItems';
import {Callback} from "polar-shared/src/util/Functions";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {DocActions} from "./DocActions";

interface IProps extends DocActions.DocContextMenu.Callbacks {
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
                onClose={() => this.props.onClose()}
                onClick={() => this.props.onClose()}>

                <MUIDocDropdownMenuItems {...this.props}/>

            </Menu>
        );
    }
}
