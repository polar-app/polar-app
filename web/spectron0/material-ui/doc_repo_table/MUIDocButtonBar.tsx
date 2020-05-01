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

interface IProps {

    readonly className?: string;

    readonly viewIndex: number;
    readonly flagged: boolean;
    readonly archived: boolean;

}

type SelectRowCallback = (event: React.MouseEvent) => void;

function useSelectRowCallback(viewIndex: number,
                              delegate: () => void) {

    const callbacks = useDocRepoCallbacks();

    return useCallback<SelectRowCallback>((event) => {

        callbacks.selectRow(viewIndex, event, 'click');
        delegate();

    }, [viewIndex, delegate]);

}

export const MUIDocButtonBar = React.memo((props: IProps) => {

    const callbacks = useDocRepoCallbacks();

    const {viewIndex} = props;

    const onTagged = useSelectRowCallback(viewIndex, callbacks.onTagged);
    const onArchived = useSelectRowCallback(viewIndex, callbacks.onArchived);
    const onFlagged = useSelectRowCallback(viewIndex, callbacks.onFlagged);

    return (

        <div className={props.className || ''} onClick={() => callbacks.setSelected([viewIndex])}>

            <MUIDocTagButton onClick={onTagged}/>

            <MUIDocArchiveButton onClick={onArchived}
                                 active={props.archived}/>

            <MUIDocFlagButton onClick={onFlagged}
                              active={props.flagged}/>

            <Tooltip title="More options...">
                <MUIDocDropdownButton onClick={(event) => callbacks.selectRow(viewIndex, event, 'click')}/>
            </Tooltip>

        </div>
    );

}, isEqual);
