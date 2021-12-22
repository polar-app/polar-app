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
import {useBlocksStore} from "../../../../web/js/notes/store/BlocksStore";
import {useNoteLinkLoader} from "../../../../web/js/notes/NoteLinkLoader";
import {namedBlocksComparator} from "../../../../web/js/notes/NoteUtils";
import {NotesRepoTableRow} from "./NotesRepoTableRow";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {NotesRepoTableToolbar} from "./NotesRepoTableToolbar";
import {NotesRepoTableHead} from './NotesRepoTableHead';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {BaseR, createTableGridStore, Order} from "./TableGridStore";
import {createContextMenu} from '../doc_repo/MUIContextMenu2';
import {NotesRepoContextMenu} from "./NotesRepoContextMenu";
import {Comparators} from "polar-shared/src/util/Comparators";
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";
import {profiled} from "../../../../web/js/profiler/ProfiledComponents";
import {BlockTextContentUtils} from "../../../../web/js/notes/BlockTextContentUtils";
import Comparator = Comparators.Comparator;

const VisibleComponent = observer(function VisibleComponent(props: VisibleComponentProps<INotesRepoRow>) {

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

const DocRepoBlockComponent = deepMemo(function DocRepoBlockComponent(props: BlockComponentProps<INotesRepoRow>) {

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

interface NotesRepoContextMenuOrigin {

}

export const [NotesRepoContextMenuProvider, useNotesRepoContextMenu]
    = createContextMenu<NotesRepoContextMenuOrigin>(NotesRepoContextMenu, {name: 'notes-repo'});

export const [TableGridStoreProvider, useTableGridStore] = createTableGridStore<IBlock<INamedContent>, INotesRepoRow>({
    comparatorFactory,
    order: 'asc',
    orderBy: 'title',
    columnDescriptors: [
        { id: 'title', type: 'text', disablePadding: true, label: 'Title', defaultLabel: "Untitled", width: 'auto', defaultOrder: 'asc' },
        { id: 'created', type: 'date', disablePadding: true, label: 'Created', width: '7em', defaultOrder: 'desc', devices: ['desktop', 'tablet'] },
        { id: 'updated', type: 'date', disablePadding: true, label: 'Updated', width: '7em', defaultOrder: 'desc', devices: ['desktop', 'tablet'] },
    ],
    toRow
});

export const NotesRepoTable2 = profiled(observer(function NotesRepoTable2() {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();
    const tableGridStore = useTableGridStore();

    const {view} = tableGridStore;

    React.useEffect(() => {
        tableGridStore.setOpener(id => noteLinkLoader(id))
    }, [tableGridStore, noteLinkLoader])

    const data = React.useMemo(() => blocksStore.namedBlocks, [blocksStore.namedBlocks]);

    React.useEffect(() => {
        tableGridStore.setData(data);
    }, [tableGridStore, data]);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    return (

        <MUIElevation elevation={0}
                      style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                      }}>

            <>

                <NotesRepoTableToolbar />

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

                        <NotesRepoContextMenuProvider>
                            {root && (
                                <IntersectionList values={view}
                                                  root={root}
                                                  blockSize={25}
                                                  BlockComponent={DocRepoBlockComponent}
                                                  HiddenBlockComponent={HiddenBlockComponent}
                                                  VisibleComponent={VisibleComponent}/>)}
                        </NotesRepoContextMenuProvider>

                    </Table>
                </TableContainer>
            </>

        </MUIElevation>
    );

}));

const HEIGHT = 40;

function toRow(data: IBlock<INamedContent>): INotesRepoRow {

    return {
        title: BlockTextContentUtils.getTextContentMarkdown(data.content),
        created: data.created,
        id: data.id,
        updated: data.updated,
    }

}

function createComparator<R extends BaseR>(field: keyof INotesRepoRow): Comparator<IBlock<INamedContent>> {

    switch (field) {

        case "title":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return namedBlocksComparator(a, b);
            }
        case "created":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.created.localeCompare(b.created);
            }
        case "updated":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.updated.localeCompare(b.updated);
            }
        case "id":
            return (a: IBlock<INamedContent>, b: IBlock<INamedContent>) => {
                return a.id.localeCompare(b.id);
            }

    }

}

function comparatorFactory(field: keyof INotesRepoRow, order: Order): Comparator<IBlock<INamedContent>> {
    const comparator = createComparator(field);
    return order === 'asc' ? comparator : Comparators.reverse(comparator);
}
