import React, {useCallback} from "react";
import {MUIDocDropdownButton} from "./MUIDocDropdownButton";
import {useDocRepoCallbacks} from "../../../../apps/repository/js/doc_repo/DocRepoStore2";
import isEqual from "react-fast-compare";
import {IDStr} from "polar-shared/src/util/Strings";
import { MUIDocTagButton } from "./buttons/MUIDocTagButton";
import { MUIDocArchiveButton } from "./buttons/MUIDocArchiveButton";
import { MUIDocFlagButton } from "./buttons/MUIDocFlagButton";

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

    }, [callbacks, id, delegate]);

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

            {/*<Tooltip title="More options...">*/}
                <MUIDocDropdownButton onClick={(event) => callbacks.selectRow(viewID, event, 'click')}/>
            {/*</Tooltip>*/}

        </div>
    );

}, isEqual);
