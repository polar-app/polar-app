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
import {BlockTextContentUtils} from "../../../../web/js/notes/NoteUtils";
import {NotesRepoTableRow} from "./NotesRepoTableRow";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {NotesRepoTableToolbar} from "./NotesRepoTableToolbar";
import {NotesRepoTableHead} from './NotesRepoTableHead';
import {Order, useNotesRepoStore} from "./NotesRepoStore";
import {Comparators} from "polar-shared/src/util/Comparators";
import Comparator = Comparators.Comparator;

const VisibleComponent = deepMemo(function VisibleComponent(props: VisibleComponentProps<INotesRepoRow>) {

    // const {selected} = useDocRepoStore(['selected']);

    const viewIndex = props.index;
    const row = props.value;

    return (
        <NotesRepoTableRow viewIndex={viewIndex}
                           key={viewIndex}
                           selected={false}
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
    readonly created: Date,
    readonly updated: Date,
    readonly id: string;
}

// export const [DocRepoContextMenu, useDocRepoContextMenu]
//     = createContextMenu<IDocViewerContextMenuOrigin>(MUIDocDropdownMenuItems, {name: 'doc-repo'});

function createComparator(field: keyof INotesRepoRow): Comparator<INotesRepoRow> {

    console.log("FIXME: Creating comparator for: " + field)

    switch (field) {

        case "title":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.title.localeCompare(b.title);
            }
        case "created":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.created.getTime() - b.created.getTime();
            }
        case "updated":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.updated.getTime() - b.updated.getTime();
            }
        case "id":
            return (a: INotesRepoRow, b: INotesRepoRow) => {
                return a.id.localeCompare(b.id);
            }

    }

}

function createComparatorWithOrder(field: keyof INotesRepoRow, order: Order): Comparator<INotesRepoRow> {
    const comparator = createComparator(field);
    return order === 'asc' ? comparator : Comparators.reverse(comparator);
}

export const NotesRepoTable2 = observer(function NotesRepoTable2() {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();
    const notesRepoStore = useNotesRepoStore();

    const {order, orderBy} = notesRepoStore;

    // FIXME: this should useNamedBlocks and the standard comparator we used? The same one
    // in the search bar.
    const data: ReadonlyArray<INotesRepoRow> = React.useMemo(() => (
        blocksStore.namedBlocks.map(block => block.toJSON())
            .map((current): INotesRepoRow => ({
                title: BlockTextContentUtils.getTextContentMarkdown(current.content),
                created: new Date(current.created),
                id: current.id,
                updated: new Date(current.updated),
            }))
    ), [blocksStore.namedBlocks]);

    const view = React.useMemo(() => {
        const comparator = createComparatorWithOrder(orderBy, order);
        return [...data].sort(comparator);
    }, [data, orderBy, order])

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
                                    height: '100%'
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

                        {/*<DocRepoContextMenu>*/}
                            {root && (
                                <IntersectionList values={view}
                                                  root={root}
                                                  blockSize={25}
                                                  BlockComponent={DocRepoBlockComponent}
                                                  HiddenBlockComponent={HiddenBlockComponent}
                                                  VisibleComponent={VisibleComponent}/>)}
                        {/*</DocRepoContextMenu>*/}

                    </Table>
                </TableContainer>
            </>

        </MUIElevation>
    );

});

const HEIGHT = 40;
