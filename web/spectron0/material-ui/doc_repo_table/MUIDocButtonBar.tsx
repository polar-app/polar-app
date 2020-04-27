import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {MUIDocDropdownButton} from "./MUIDocDropdownButton";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {Callback1} from "polar-shared/src/util/Functions";
import {
    MUIDocArchiveButton,
    MUIDocFlagButton,
    MUIDocTagButton
} from "./MUIDocButtons";

interface IProps {

    readonly className?: string;
    readonly flagged: boolean;
    readonly archived: boolean;

    readonly repoDocInfo: RepoDocInfo;

    readonly onTagged: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onArchived: Callback1<ReadonlyArray<RepoDocInfo>>;
    readonly onFlagged: Callback1<ReadonlyArray<RepoDocInfo>>;

    readonly onDocDropdown: Callback1<React.MouseEvent>;

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    return (

        <div className={props.className || ''}>

            <MUIDocTagButton onClick={() => props.onTagged([props.repoDocInfo])}/>

            <MUIDocArchiveButton onClick={() => props.onArchived([props.repoDocInfo])}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={() => props.onFlagged([props.repoDocInfo])}
                              active={props.flagged}/>

            <Tooltip title="More options...">
                <MUIDocDropdownButton onClick={props.onDocDropdown}/>
            </Tooltip>

        </div>
    );

});
