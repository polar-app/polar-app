import React from "react";
import {useDocRepoCallbacks} from "../DocRepoStore2";
import {useDocRepoContextMenu} from "../DocRepoTable2";
import {StandardIconButton} from "./StandardIconButton";
import {IDStr} from "polar-shared/src/util/Strings";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface OverflowMenuButtonProps {
    readonly viewID: IDStr;
}

export const OverflowMenuButton = React.memo(function OverflowMenuButton(props: OverflowMenuButtonProps) {

    const {viewID} = props;

    const {selectRow} = useDocRepoCallbacks();
    const contextMenuHandlers = useDocRepoContextMenu();

    const handleDropdownMenu = React.useCallback((event: React.MouseEvent) => {
        selectRow(viewID, event, 'click');
        contextMenuHandlers.onContextMenu(event)
    }, [contextMenuHandlers, selectRow, viewID]);

    return (
        <StandardIconButton tooltip="More"
                            aria-controls="doc-dropdown-menu"
                            aria-haspopup="true"
                            onClick={handleDropdownMenu}
                            size="small">
            <MoreVertIcon/>
        </StandardIconButton>
    );

});
