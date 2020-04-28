import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {MUIDocDropdownButton} from "./MUIDocDropdownButton";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {
    MUIDocArchiveButton,
    MUIDocFlagButton,
    MUIDocTagButton
} from "./MUIDocButtons";
import {useDocRepoCallbacks} from "../../../../apps/repository/js/doc_repo/DocRepoStore";
import {Callback1} from "polar-shared/src/util/Functions";

interface IProps {

    readonly className?: string;
    readonly flagged: boolean;
    readonly archived: boolean;

    readonly repoDocInfo: RepoDocInfo;

    readonly onDocDropdown: Callback1<React.MouseEvent>;

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    const callbacks = useDocRepoCallbacks();

    return (

        <div className={props.className || ''}>

            <MUIDocTagButton onClick={callbacks.onTagged}/>

            <MUIDocArchiveButton onClick={callbacks.onArchived}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={callbacks.onFlagged}
                              active={props.flagged}/>

            <Tooltip title="More options...">
                <MUIDocDropdownButton onClick={props.onDocDropdown}/>
            </Tooltip>

        </div>
    );

});
