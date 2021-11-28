import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {
    BlockComponentProps,
    HiddenBlockComponentProps,
    IntersectionList,
    VisibleComponentProps
} from "../../../../web/js/intersection_list/IntersectionList";
import TableRow from '@material-ui/core/TableRow';
import {Numbers} from "polar-shared/src/util/Numbers";
import {observer} from "mobx-react-lite";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {BaseD, BaseR, createTableGridStore, ICreateTableGridStoreOpts} from "./TableGridStore";
import {ContextMenuComponent, createContextMenu} from '../doc_repo/MUIContextMenu2';
import {IconButton, TableCell} from "@material-ui/core";
import {TableGridOverflowMenuButton} from './TableGridOverflowMenuButton';
import {MUICheckboxIconButton} from "../../../../web/js/mui/MUICheckboxIconButton";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {Devices} from "polar-shared/src/util/Devices";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {StandardIconButton} from "../doc_repo/buttons/StandardIconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {Sorting} from "../doc_repo/Sorting";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import TableHead from "@material-ui/core/TableHead";

interface CreateTableGridOpts<D extends BaseD, R extends BaseR, O> extends ICreateTableGridStoreOpts<D, R> {
    readonly ContextMenu: ContextMenuComponent<O>;
}

export function createTableGrid<D extends BaseD, R extends BaseR, O>(opts: CreateTableGridOpts<D, R, O>) {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({

            cell: {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                textOverflow: 'ellipsis'
            },

            head: {
                backgroundColor: theme.palette.background.default
            },

            row: {
                "& th": {
                    paddingTop: Devices.isDesktop() ? theme.spacing(1) : theme.spacing(0),
                    paddingBottom: Devices.isDesktop() ? theme.spacing(1) : theme.spacing(0),
                    paddingLeft: 0,
                    paddingRight: 0,
                    borderCollapse: 'collapse',
                    lineHeight: '1em'
                }
            },

            visuallyHidden: {
                border: 0,
                clip: 'rect(0 0 0 0)',
                height: 1,
                margin: -1,
                overflow: 'hidden',
                padding: 0,
                position: 'absolute',
                top: 20,
                width: 1,
            },


            checkInactive: {
                color: theme.palette.text.secondary
            },
            checkActive: {
                color: theme.palette.secondary.main
            },

            th: {
                whiteSpace: 'nowrap',
                width: '84px'
            },

        }),
    );

    const [TableGridStoreProvider, useTableGridStore] = createTableGridStore<D, R>({
        ...opts
    });

    const [ContextMenuProvider, useContextMenu] = createContextMenu(opts.ContextMenu, {});

    const VisibleComponent = observer(function VisibleComponent(props: VisibleComponentProps<R>) {

        const tableGridStore = useTableGridStore()
        const contextMenuHandlers = useContextMenu();

        const {selected} = tableGridStore;

        const viewIndex = props.index;
        const row = props.value;

        return (
            <TableGridRow viewIndex={viewIndex}
                          key={viewIndex}
                          onOpen={id => tableGridStore.onOpen(id)}
                          onContextMenu={event => contextMenuHandlers.onContextMenu(event)}
                          selected={selected.includes(row.id)}
                          {...props.value}/>
        );

    });

    const DocRepoBlockComponent = deepMemo(function DocRepoBlockComponent(props: BlockComponentProps<R>) {

        const height = Numbers.sum(...props.values.map(() => HEIGHT));

        return (
            <TableBody ref={props.innerRef}
                       style={{
                           height,
                           minHeight: height,
                           flexGrow: 1
                       }}>
                {props.children}
            </TableBody>
        );

    });

    const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<R>) {

        const height = Numbers.sum(...props.values.map(() => HEIGHT));

        return (
            <TableRow style={{
                minHeight: `${height}px`,
                height: `${height}px`,
            }}>

            </TableRow>
        );

    });


    const GridTableCheck = observer(function GridTableCheck() {

        const classes = useStyles();
        const tableGridStore = useTableGridStore();
        const {view, selected} = tableGridStore;

        const handleCheckbox = React.useCallback((checked: boolean) => {
            checked ? tableGridStore.setSelected('all') : tableGridStore.setSelected('none');
        }, [tableGridStore]);

        const indeterminate = selected.length > 0 && selected.length < view.length;
        const checked = selected.length === view.length && view.length !== 0;

        const mode = indeterminate ? 'i' :  checked? 'c' : 'n';

        const className = mode === 'n' ? classes.checkInactive : classes.checkActive;

        return (
            <IconButton className={className} onClick={() => handleCheckbox(mode === 'n')}>
                {mode === 'i' && <IndeterminateCheckBoxIcon/>}
                {mode === 'c' && <CheckBoxIcon/>}
                {mode === 'n' && <CheckBoxOutlineBlankIcon/>}
            </IconButton>
        );

    });

    const CheckPlaceholder = React.memo(function CheckPlaceholder() {
        return (
            <TableCell padding="checkbox"/>
        )
    });

    const TableGridHead = observer(function TableGridHead() {

        const classes = useStyles();

        const tableGridStore = useTableGridStore();

        const {order, orderBy} = tableGridStore;

        return (

            <TableHead className={classes.head}>
                <TableRow className={classes.row}>
                    <DeviceRouters.NotDesktop>
                        <TableCell style={{width:'50px'}}>
                            <GridTableCheck/>
                        </TableCell>
                    </DeviceRouters.NotDesktop>

                    {/* This is just a placeholder to align the table, it doesn't do much else */}
                    <DeviceRouters.Desktop>
                        <CheckPlaceholder/>
                    </DeviceRouters.Desktop>

                    {tableGridStore.columnDescriptors.map((column) => {

                        const newOrder = orderBy === column.id ? Sorting.reverse(order) : column.defaultOrder;

                        return (
                            <React.Fragment key={column.id as string}>
                                <DeviceRouters.Any devices={column.devices}>

                                    <TableCell className={classes.th}
                                               style={{
                                                   width: column.width,
                                                   minWidth: column.width
                                               }}
                                               padding={column.disablePadding ? 'none' : 'default'}
                                               sortDirection={orderBy === column.id ? order : false}>

                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={order}
                                            hideSortIcon
                                            onClick={() => tableGridStore.setOrderBy(column.id, newOrder)}>
                                            {column.label}
                                            {orderBy === column.id ? (
                                                <span className={classes.visuallyHidden}>
                                                        {order === 'asc' ? 'sorted ascending' : 'sorted descending'}
                                                    </span>
                                            ) : null}
                                        </TableSortLabel>
                                    </TableCell>
                                </DeviceRouters.Any>
                            </React.Fragment>
                        )
                    })}

                    <TableCell style={{width:'30px'}} padding="none">
                        {/*<Check/>*/}
                    </TableCell>

                </TableRow>
            </TableHead>
        );
    });

    interface TableGridOverflowMenuButtonProps {
        readonly id: string;
    }

    const TableGridOverflowMenuButton = observer(function TableGridOverflowMenuButton(props: TableGridOverflowMenuButtonProps) {

        const tableGridStore = useTableGridStore();

        const contextMenuHandlers = useContextMenu();

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

    interface TableGridRowProps extends BaseR {
        readonly viewIndex: number;
        readonly selected: boolean;
        readonly onContextMenu: (event: React.MouseEvent) => void;
        readonly onOpen: (id: string) => void;
    }

    const TableGridRow = React.memo(function TableGridRow(props: TableGridRowProps & R) {

        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={props.selected}
                draggable
                onContextMenu={event => props.onContextMenu(event)}
                onDoubleClick={() => props.onOpen(props.id)}
                selected={props.selected}>

                <TableGridCells {...props}/>

            </TableRow>
        );
    });


    interface TableGridCellsProps {
        readonly selected: boolean;
        readonly viewIndex: number;
    }

    const TableGridCells = observer(function TableGridCells(props: TableGridCellsProps & R) {

        const classes = useStyles();
        const tableGridStore = useTableGridStore();

        const {selected} = props;

        const contextMenuHandler = React.useCallback((event: React.MouseEvent) => {
        //     selectRow(row.id, event, 'context');
        //     rawContextMenuHandler(event);
        }, []);

        const selectRowClickHandler = React.useCallback((event: React.MouseEvent) => {

            tableGridStore.selectRow(props.id, event, 'click');

            if (Devices.isTablet() || Devices.isPhone()) {
                tableGridStore.onOpen(props.id);
            }

        }, [tableGridStore, props.id]);

        return (
            <>

                <TableCell padding="none"
                           onClick={event => event.stopPropagation()}
                           onDoubleClick={event => event.stopPropagation()}>
                    <MUICheckboxIconButton checked={selected}
                                           onChange={(event) => tableGridStore.selectRow(props.id, event, 'checkbox')}/>
                </TableCell>

                {tableGridStore.columnDescriptors.map(columnDescriptor => (

                    <React.Fragment key={columnDescriptor.id as string}>

                        <DeviceRouters.Any devices={columnDescriptor.devices}>

                            <TableCell className={classes.cell}
                                       padding={columnDescriptor.disablePadding ? 'none' : undefined}
                                       style={{width: columnDescriptor.width}}
                                       onClick={selectRowClickHandler}
                                       onContextMenu={contextMenuHandler}>

                                {columnDescriptor.type === 'text' && (
                                    props[columnDescriptor.id] || columnDescriptor.defaultLabel || ""
                                )}

                                {columnDescriptor.type === 'date' && props[columnDescriptor.id] && (
                                    <DateTimeTableCell datetime={props[columnDescriptor.id] as unknown as string}/>
                                )}

                                {columnDescriptor.type === 'number' && (
                                    <>
                                        {props[columnDescriptor.id]}
                                    </>
                                )}

                            </TableCell>

                        </DeviceRouters.Any>

                    </React.Fragment>

                ))}

                <TableCell align="right"
                           padding="none"
                           onClick={event => event.stopPropagation()}
                           onDoubleClick={event => event.stopPropagation()}>
                    <TableGridOverflowMenuButton id={props.id}/>
                </TableCell>

            </>
        );

    });


    const TableGrid = observer(function TableGrid() {

        const tableGridStore = useTableGridStore();

        const {view} = tableGridStore;

        const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

        return (
            <TableGridStoreProvider>
                <MUIElevation elevation={0}
                              style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column'
                              }}>

                    <>

                        {/*<NotesRepoTableToolbar/>*/}

                        <TableContainer ref={setRoot}
                                        style={{
                                            flexGrow: 1,
                                            // height: Devices.isDesktop()? '100%':'calc(100% - 124px)'
                                            height: '100%',
                                            overflowX: 'hidden'
                                        }}>
                            <Table
                                stickyHeader
                                style={{
                                    minWidth: 0,
                                    maxWidth: '100%',
                                    tableLayout: 'fixed'
                                }}
                                aria-labelledby="tableTitle"
                                size={'medium'}
                                aria-label="enhanced table">

                                <TableGridHead/>

                                <ContextMenuProvider>
                                    {root && (
                                        <IntersectionList values={view}
                                                          root={root}
                                                          blockSize={25}
                                                          BlockComponent={DocRepoBlockComponent}
                                                          HiddenBlockComponent={HiddenBlockComponent}
                                                          VisibleComponent={VisibleComponent}/>)}
                                </ContextMenuProvider>

                            </Table>
                        </TableContainer>
                    </>

                </MUIElevation>
            </TableGridStoreProvider>
        );

    });

    return [TableGrid];

}

const HEIGHT = 40;
