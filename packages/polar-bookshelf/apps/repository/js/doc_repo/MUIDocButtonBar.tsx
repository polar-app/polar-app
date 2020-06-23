import React, {useCallback} from "react";
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
import {IDStr} from "polar-shared/src/util/Strings";

interface IProps {

    readonly className?: string;

    readonly viewID: IDStr;
    readonly flagged: boolean;
    readonly archived: boolean;

}

type SelectRowCallback = (event: React.MouseEvent) => void;

function useSelectRowCallback(id: IDStr,
                              delegate: () => void) {

    const callbacks = useDocRepoCallbacks();

    return useCallback<SelectRowCallback>((event) => {

        callbacks.selectRow(id, event, 'click');
        delegate();

    }, [id, delegate]);

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    const callbacks = useDocRepoCallbacks();

    const {viewID} = props;

    const onTagged = useSelectRowCallback(viewID, callbacks.onTagged);
    const onArchived = useSelectRowCallback(viewID, callbacks.onArchived);
    const onFlagged = useSelectRowCallback(viewID, callbacks.onFlagged);

    return (

        <div className={props.className || ''} onClick={() => callbacks.setSelected([viewID])}>

            <MUIDocTagButton onClick={onTagged}/>

            <MUIDocArchiveButton onClick={onArchived}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={onFlagged}
                              active={props.flagged}/>

            <Tooltip title="More options...">
                <MUIDocDropdownButton onClick={(event) => callbacks.selectRow(viewID, event, 'click')}/>
            </Tooltip>

        </div>
    );

}, isEqual);
