import React from "react";
import moment from "moment";
import {GridCellParams, GridColDef, GridRowParams, XGrid} from '@material-ui/x-grid';
import {NamedContent, useBlocksStore} from "./store/BlocksStore";
import {NotesInnerContainer} from "./NotesContainer";
import {autorun} from "mobx";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {createStyles, fade, ListItemIcon, ListItemText, makeStyles, MenuItem} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {StandardIconButton} from "../../../apps/repository/js/doc_repo/buttons/StandardIconButton";
import {createContextMenu, MenuComponentProps} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import LaunchIcon from "@material-ui/icons/Launch";
import DeleteIcon from "@material-ui/icons/Delete";
import {RoutePathnames} from "../apps/repository/RoutePathnames";
import {BlockTextContentUtils} from "./NoteUtils";
import {Block} from "./store/Block";
import {NotesToolbar} from "./NotesToolbar";

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
        window.open(RoutePathnames.NOTE(row.title), '_blank');
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

export const NoteRepoScreen: React.FC = () => {
    const classes = useStyles();
    const blocksStore = useBlocksStore();
    const history = useHistory();
    const [rows, setRows] = React.useState<TableRow[]>([]);

    React.useEffect(() => autorun(() => {
        const ids = Object.values(blocksStore.indexByName);
        const blocks = (blocksStore.idsToBlocks(ids) as Block<NamedContent>[])
            .map(block => block.toJSON())
            .map(({ id, content, created, updated }) => ({
                title: BlockTextContentUtils.getTextContentMarkdown(content),
                created: new Date(created),
                id,
                updated: new Date(updated),
            }));
        setRows(blocks);
    }), [blocksStore]);

    const handleDoubleClick = React.useCallback(({ id }: GridRowParams) => {
        const block = blocksStore.getBlockByTarget(id as string) as Block<NamedContent>;
        history.push(RoutePathnames.NOTE(BlockTextContentUtils.getTextContentMarkdown(block.content)));
    }, [history, blocksStore]);

    return (
        <>
            <NotesToolbar />
            <NotesInnerContainer>
                <XGrid
                    className={classes.root}
                    columns={BLOCK_TABLE_COLUMNS}
                    rows={rows}
                    onRowDoubleClick={handleDoubleClick}
                    pagination
                    checkboxSelection
                />
            </NotesInnerContainer>
        </>
    );
};
