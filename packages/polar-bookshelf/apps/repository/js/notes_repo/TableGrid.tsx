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
import {NotesRepoTableRow} from "./NotesRepoTableRow";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {NotesRepoTableToolbar} from "./NotesRepoTableToolbar";
import {NotesRepoTableHead} from './NotesRepoTableHead';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BaseD, BaseR, createTableGridStore, ICreateTableGridStoreOpts} from "./TableGridStore";
import {ContextMenuComponent, createContextMenu} from '../doc_repo/MUIContextMenu2';

const VisibleComponent = observer(function VisibleComponent<R extends BaseR>(props: VisibleComponentProps<R>) {

    const tableGridStore = useTableGridStore()

    const {selected} = tableGridStore;

    const viewIndex = props.index;
    const row = props.value;

    return (
        <NotesRepoTableRow viewIndex={viewIndex}
                           key={viewIndex}
                           selected={selected.includes(row.id)}
                           {...props.value}/>
    );

});

const DocRepoBlockComponent = deepMemo(function DocRepoBlockComponent<R extends BaseR>(props: BlockComponentProps<R>) {

    const height = Numbers.sum(...props.values.map(current => HEIGHT));

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

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<INotesRepoRow>) {

    const height = Numbers.sum(...props.values.map(current => HEIGHT));

    return (
        <TableRow style={{
            minHeight: `${height}px`,
            height: `${height}px`,
        }}>

        </TableRow>
    );

});

export interface INotesRepoRow {
    readonly title: string;
    readonly created: ISODateTimeString,
    readonly updated: ISODateTimeString,
    readonly id: string;
}


interface CreateTableGridOpts<D extends BaseD, R extends BaseR, O> extends ICreateTableGridStoreOpts<D, R> {
    readonly ContextMenu: ContextMenuComponent<O>;
}

export function createTableGrids<D extends BaseD, R extends BaseR, O>(opts: CreateTableGridOpts<D, R, O>) {

    const [TableGridStoreProvider, useTableGridStore] = createTableGridStore<D, R>({
        ...opts
    });

    const [ContextMenuProvider, useContextMenu] = createContextMenu(opts.ContextMenu, {});

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

                        <NotesRepoTableToolbar/>

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

                                <NotesRepoTableHead/>

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
