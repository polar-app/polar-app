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
import {useNotesRepoStore} from "./NotesRepoStore";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

const VisibleComponent = observer(function VisibleComponent(props: VisibleComponentProps<INotesRepoRow>) {

    const notesRepoStore = useNotesRepoStore()

    const {selected} = notesRepoStore;

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

// export const [DocRepoContextMenu, useDocRepoContextMenu]
//     = createContextMenu<IDocViewerContextMenuOrigin>(MUIDocDropdownMenuItems, {name: 'doc-repo'});


export const NotesRepoTable2 = observer(function NotesRepoTable2() {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();
    const notesRepoStore = useNotesRepoStore();

    const {order, orderBy, view} = notesRepoStore;

    // FIXME: this should useNamedBlocks and the standard comparator we used? The same one
    // in the search bar.
    const data: ReadonlyArray<INotesRepoRow> = React.useMemo(() => (
        blocksStore.namedBlocks.map(block => block.toJSON())
            .map((current): INotesRepoRow => ({
                title: BlockTextContentUtils.getTextContentMarkdown(current.content),
                created: current.created,
                id: current.id,
                updated: current.updated,
            }))
    ), [blocksStore.namedBlocks]);

    React.useEffect(() => {
        notesRepoStore.setData(data);
    }, [data]);

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
