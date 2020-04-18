import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleIcon from '@material-ui/icons/Title';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Divider from "@material-ui/core/Divider";
import {Callback1} from "polar-shared/src/util/Functions";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {AppRuntime} from "../../../js/AppRuntime";
import {FeatureToggles} from "polar-shared/src/util/FeatureToggles";

export interface DocContextMenuCallbacks {
    readonly onOpen: Callback1<RepoDocInfo>;
    readonly onRename: Callback1<RepoDocInfo>;
    readonly onShowFile: Callback1<RepoDocInfo>;
    readonly onCopyOriginalURL: Callback1<RepoDocInfo>;
    readonly onCopyFilePath: Callback1<RepoDocInfo>;
    readonly onCopyDocumentID: Callback1<RepoDocInfo>;
    readonly onDelete: (repoDocInfos: ReadonlyArray<RepoDocInfo>) => void;
}

export interface DocContextMenuProps extends DocContextMenuCallbacks {
    readonly selectedProvider: () => ReadonlyArray<RepoDocInfo>;
}

interface IProps extends DocContextMenuProps {
}

// NOTE that this CAN NOT be a functional component as it breaks MUI menu
// component.
export class MUIDocDropdownMenuItems extends React.Component<IProps> {

    public render() {

        const selected = this.props.selectedProvider();

        // if (selected.length === 0) {
        //     // there's nothing to render now...
        //     return null;
        // }

        const isMulti = selected.length > 1;
        const isSingle = selected.length === 1;

        const repoDocInfo = selected[0];

        return (
            <>
                {isSingle &&
                    <MenuItem onClick={() => this.props.onOpen(repoDocInfo)}>
                        <ListItemIcon>
                            <SendIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Open Document" />
                    </MenuItem>}

                {isSingle &&
                    <MenuItem onClick={() => this.props.onRename(repoDocInfo)}>
                        <ListItemIcon>
                            <TitleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Rename" />
                    </MenuItem>}

                {isSingle && ! AppRuntime.isBrowser() &&
                    <MenuItem onClick={() => this.props.onShowFile(repoDocInfo)}>
                        <ListItemIcon>
                            <InsertDriveFileIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Show File" />
                    </MenuItem>}

                {isSingle && repoDocInfo.url &&
                    <MenuItem onClick={() => this.props.onCopyOriginalURL(repoDocInfo)}>
                        <ListItemIcon>
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Copy Original URL" />
                    </MenuItem>}

                {isSingle && ! AppRuntime.isBrowser() &&
                    <MenuItem onClick={() => this.props.onCopyFilePath(repoDocInfo)}>
                        <ListItemIcon>
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Copy File Path" />
                    </MenuItem>}

                {isSingle && FeatureToggles.get('dev') &&
                    <MenuItem onClick={() => this.props.onCopyDocumentID(repoDocInfo)}>
                        <ListItemIcon>
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Copy Document ID" />
                    </MenuItem>}

                <Divider/>

                <MenuItem onClick={() => this.props.onDelete(selected)}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Delete" />
                </MenuItem>
            </>
        );
    }
}
