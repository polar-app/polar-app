import React, {useCallback} from "react";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import isEqual from "react-fast-compare";
import {IDStr} from "polar-shared/src/util/Strings";
import { MUIDocTagButton } from "./buttons/MUIDocTagButton";
import { MUIDocArchiveButton } from "./buttons/MUIDocArchiveButton";
import { MUIDocFlagButton } from "./buttons/MUIDocFlagButton";
import {MUIButtonBar} from "../../../../web/js/mui/MUIButtonBar";
import { OverflowMenuButton } from "./buttons/DocOverflowMenuButton";

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

export const MUIDocButtonBar = React.memo(function MUIDocButtonBar(props: IProps) {

    const callbacks = useDocRepoCallbacks();

    const {viewID} = props;

    const onTagged = useSelectRowCallback(viewID, callbacks.onTagged);
    const onArchived = useSelectRowCallback(viewID, callbacks.onArchived);
    const onFlagged = useSelectRowCallback(viewID, callbacks.onFlagged);

    return (

        <MUIButtonBar className={props.className || ''}
                      style={{justifyContent: 'flex-end'}}
                      onClick={() => callbacks.setSelected([viewID])}>

            <MUIDocTagButton onClick={onTagged}/>

            <MUIDocArchiveButton onClick={onArchived}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={onFlagged}
                              active={props.flagged}/>

            <OverflowMenuButton viewID={viewID}/>

        </MUIButtonBar>
    );

}, isEqual);
