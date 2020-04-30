import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {MUIDocDropdownButton} from "./MUIDocDropdownButton";
import {
    MUIDocArchiveButton,
    MUIDocFlagButton,
    MUIDocTagButton
} from "./MUIDocButtons";
import {
    useDocRepoCallbacks
} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import isEqual from "react-fast-compare";

interface IProps {

    readonly className?: string;

    readonly viewIndex: number;
    readonly flagged: boolean;
    readonly archived: boolean;

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    const callbacks = useDocRepoCallbacks();

    // FIXME: new useDocRepoSelected()
    const {viewIndex} = props;

    return (

        <div className={props.className || ''}>

            <MUIDocTagButton onClick={callbacks.onTagged}/>

            <MUIDocArchiveButton onClick={callbacks.onArchived}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={callbacks.onFlagged}
                              active={props.flagged}/>

            <Tooltip title="More options...">
                <MUIDocDropdownButton onClick={(event) => callbacks.selectRow(viewIndex, event, 'click')}/>
            </Tooltip>

        </div>
    );

}, isEqual);
