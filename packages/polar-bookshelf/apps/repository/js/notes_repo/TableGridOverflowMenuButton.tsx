import {observer} from "mobx-react-lite";
import React from "react";

interface TableGridOverflowMenuButtonProps {
    readonly id: string;
}

export const TableGridOverflowMenuButton = observer(function TableGridOverflowMenuButton(props: TableGridOverflowMenuButtonProps) {

    // const tableGridStore = useTableGridStore();
    //
    // const contextMenuHandlers = useNotesRepoContextMenu();
    //
    // const handleDropdownMenu = React.useCallback((event: React.MouseEvent) => {
    //     tableGridStore.selectRow(props.id, event, 'click');
    //     contextMenuHandlers.onContextMenu(event)
    // }, []);
    //
    // return (
    //     <StandardIconButton tooltip="More"
    //         // aria-controls="doc-dropdown-menu"
    //                         aria-haspopup="true"
    //                         onClick={handleDropdownMenu}
    //                         size="small">
    //         <MoreVertIcon/>
    //     </StandardIconButton>
    // );

    return null;

});

