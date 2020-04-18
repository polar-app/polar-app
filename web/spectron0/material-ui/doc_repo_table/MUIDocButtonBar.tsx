import React from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import grey from "@material-ui/core/colors/grey";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ArchiveIcon from "@material-ui/icons/Archive";
import FlagIcon from "@material-ui/icons/Flag";
import {MUIDocDropdownButton} from "./MUIDocDropdownButton";
import {DocContextMenuProps} from "./MUIDocDropdownMenuItems";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Callback1} from "polar-shared/src/util/Functions";

interface IProps extends DocContextMenuProps {

    readonly className?: string;
    readonly flagged: boolean;
    readonly archived: boolean;

    readonly repoDocInfo: RepoDocInfo;

    readonly onTagRequested: Callback1<ReadonlyArray<RepoDocInfo>>;

    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;

    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    const theme = useTheme();

    const activeColor = (active: boolean) => {
        return active ? theme.palette.primary.main : theme.palette.text.secondary;
    };

    return (

        <div className={props.className || ''}>

            <Tooltip title="Tag">
                <IconButton size="small"
                            onClick={() => props.onTagRequested([props.repoDocInfo])}
                            style={{color: grey[500]}}>
                    <LocalOfferIcon/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Archive">
                <IconButton size="small"
                            onClick={() => props.onArchived([props.repoDocInfo])}
                            style={{color: activeColor(props.archived)}}>
                    <ArchiveIcon/>
                </IconButton>
            </Tooltip>

            <Tooltip title="Flag">
                <IconButton size="small"
                            onClick={() => props.onFlagged([props.repoDocInfo])}
                            style={{color: activeColor(props.flagged)}}>
                    <FlagIcon/>
                </IconButton>
            </Tooltip>

            <Tooltip title="More options...">
                <MUIDocDropdownButton {...props}/>
            </Tooltip>

        </div>
    );

});
