import {observer} from "mobx-react-lite";
import {useNotesRepoContextMenu, useTableGridStore} from "./NotesRepoTable2";
import React from "react";
import {StandardIconButton} from "../doc_repo/buttons/StandardIconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface ITableGridOverflowMenuButtonProps {
    readonly id: string;
}

export const TableGridOverflowMenuButton = observer(function TableGridOverflowMenuButton(props: ITableGridOverflowMenuButtonProps) {

    const tableGridStore = useTableGridStore();

    const contextMenuHandlers = useNotesRepoContextMenu();

    const handleDropdownMenu = React.useCallback((event: React.MouseEvent) => {
        tableGridStore.selectRow(props.id, event, 'click');
        contextMenuHandlers.onContextMenu(event)
    }, []);

    return (
        <StandardIconButton tooltip="More"
            // aria-controls="doc-dropdown-menu"
                            aria-haspopup="true"
                            onClick={handleDropdownMenu}
                            size="small">
            <MoreVertIcon/>
        </StandardIconButton>
    );

});

