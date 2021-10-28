import React from "react";
import moment from "moment";
import {GridCellParams, GridColDef, GridRowParams, MuiEvent, XGrid} from '@material-ui/x-grid';
import {NamedContent, useBlocksStore} from "./store/BlocksStore";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {createStyles, fade, ListItemIcon, ListItemText, makeStyles, MenuItem} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {StandardIconButton} from "../../../apps/repository/js/doc_repo/buttons/StandardIconButton";
import {createContextMenu, MenuComponentProps} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import {RoutePathNames} from "../apps/repository/RoutePathNames";
import {BlockTextContentUtils, useNamedBlocks} from "./NoteUtils";
import {Block} from "./store/Block";
import {NotesToolbar} from "./NotesToolbar";
import {Devices} from "polar-shared/src/util/Devices";
import {useNoteLinkLoader} from "./NoteLinkLoader";

const DATE_FORMAT = 'MMMM Do, YYYY';

const dateCellFormatter: GridColDef['valueFormatter'] = ({ value }) => {
    return moment(value as string).format(DATE_FORMAT);
};

type TableRow = {
    id: BlockIDStr;
    title: string;
    created: Date;
    updated: Date;
};


const RowActionsDropdownButton: React.FC = () => {
    const contextMenuHandlers = useBlocksTableContextMenu();

    return (
        <StandardIconButton tooltip="Actions"
                            aria-controls="doc-dropdown-menu"
                            aria-haspopup="true"
                            onClick={contextMenuHandlers.onContextMenu}
                            size="small">
            <MoreVertIcon />
        </StandardIconButton>
    );
};

const RowActionsDropdownItems: React.FC<MenuComponentProps<{}>> = () => {
    const row = React.useContext(BlocksTableContextMenuContext);
    const blocksStore = useBlocksStore();

    const handleOpen = React.useCallback(() => {
        window.open(RoutePathNames.NOTE(row.title), '_blank');
    }, [row]);

    const handleDelete = React.useCallback(() => {
        blocksStore.deleteBlocks([row.id]);
    }, [row, blocksStore]);

    return (
        <>
            <MenuItem onClick={handleOpen}>
                <ListItemIcon><LaunchIcon /></ListItemIcon>
                <ListItemText primary="Open" />
            </MenuItem>
            <MenuItem onClick={handleDelete}>
                <ListItemIcon><DeleteIcon /></ListItemIcon>
                <ListItemText primary="Delete" />
            </MenuItem>
        </>
    );
};

export const [BlocksTableContextMenu, useBlocksTableContextMenu]
    = createContextMenu(RowActionsDropdownItems, {name: 'notes-repo'});
const BlocksTableContextMenuContext = React.createContext<TableRow>(null!);

const BlocksTableContextMenuProvider: React.FC<{ row: TableRow }> = ({ row, children }) => (
    <BlocksTableContextMenuContext.Provider value={row}>
        <BlocksTableContextMenu>
            {children}
        </BlocksTableContextMenu>
    </BlocksTableContextMenuContext.Provider>
);

const BLOCK_TABLE_COLUMNS: GridColDef[] = [
    {
        field: 'title',
        headerName: 'Title',
        flex: 2,
    },
    ...(Devices.isDesktop()
        ? [
            {
                field: 'created',
                headerName: 'Added',
                flex: 1,
                valueFormatter: dateCellFormatter,
            },
            {
                field: 'updated',
                headerName: 'Updated',
                flex: 1,
                valueFormatter: dateCellFormatter,
            },
        ] : []
    ),
    {
        field: 'actions',
        headerName: ' ',
        resizable: false,
        align: 'right' as const,
        renderCell({ row }: GridCellParams) {
            return (
                <BlocksTableContextMenuProvider row={row as TableRow}>
                    <RowActionsDropdownButton />
                </BlocksTableContextMenuProvider>
            );
        }
    }
].map(col => ({ ...col, disableColumnMenu: true }));

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.primary,
            '&.MuiDataGrid-root': {
                fontSize: '1.167rem',
            },
            [`
                &.MuiDataGrid-root .MuiDataGrid-cell:focus,
                &.MuiDataGrid-root .MuiDataGrid-cell:focus-within,
                &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus,
                &.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within
            `]: {
                outline: 'none',
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnsContainer': {
                borderTop: `1px solid ${theme.palette.background.paper}`,
                borderBottom: `1px solid ${theme.palette.background.paper}`,
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnHeaderTitleContainer': {
                padding: 0,
            },
            '&.MuiDataGrid-root .Mui-odd': {
                backgroundColor: fade(theme.palette.background.paper, 1 - (theme.palette.type === 'dark' ? 0.8 : 0.6)),
            },
            '&.MuiDataGrid-root .Mui-odd:hover': {
                backgroundColor: theme.palette.background.paper,
            },
            '&.MuiDataGrid-root .MuiDataGrid-row.Mui-selected': {
                backgroundColor: fade(theme.palette.primary.main, 0.16),
            },
            '&.MuiDataGrid-root, &.MuiDataGrid-root .MuiDataGrid-cell': {
                border: 'none',
            }
        }
    })
);

export const NotesRepoScreen: React.FC = () => {
    const classes = useStyles();
    const blocksStore = useBlocksStore();
    const namedBlocks = useNamedBlocks({ sort: true });
    const noteLinkLoader = useNoteLinkLoader();

    const rows = React.useMemo(() => (
        namedBlocks.map(block => block.toJSON())
            .map(({ id, content, created, updated }) => ({
                title: BlockTextContentUtils.getTextContentMarkdown(content),
                created: new Date(created),
                id,
                updated: new Date(updated),
            }))
    ), [namedBlocks]);

    const loadNote = React.useCallback((id: BlockIDStr) => {
        const block = blocksStore.getBlockByTarget(id as string) as Block<NamedContent>;
        noteLinkLoader(BlockTextContentUtils.getTextContentMarkdown(block.content));
    }, [blocksStore, noteLinkLoader]);

    const handleDoubleClick = React.useCallback(({ id }: GridRowParams) =>
        loadNote(id as string), [loadNote]);

    const handleClick = React.useCallback(({ id }: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
        if (Devices.isDesktop()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        loadNote(id as string);
    }, [loadNote]);

    return (
        <>
            <NotesToolbar />
            <XGrid
                hideFooterSelectedRowCount={true}
                hideFooterRowCount={true}
                hideFooter={true}
                className={classes.root}
                columns={BLOCK_TABLE_COLUMNS}
                rows={rows}
                onRowDoubleClick={handleDoubleClick}
                onRowClick={handleClick}
                checkboxSelection
            />
        </>
    );
};
