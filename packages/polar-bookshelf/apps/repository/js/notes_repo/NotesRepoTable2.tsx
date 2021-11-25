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

const VisibleComponent = deepMemo(function VisibleComponent(props: VisibleComponentProps<IBlockRepoRow>) {

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

const DocRepoBlockComponent = deepMemo(function DocRepoBlockComponent(props: BlockComponentProps<IBlockRepoRow>) {

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

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<IBlockRepoRow>) {

    const height = Numbers.sum(...props.values.map(current => HEIGHT));

    return (
        <TableRow style={{
            minHeight: `${height}px`,
            height: `${height}px`,
        }}>

        </TableRow>
    );

});

export interface IBlockRepoRow {
    readonly text: string;
    readonly created: Date,
    readonly updated: Date,
    readonly id: string;
}

// export const [DocRepoContextMenu, useDocRepoContextMenu]
//     = createContextMenu<IDocViewerContextMenuOrigin>(MUIDocDropdownMenuItems, {name: 'doc-repo'});

export const NotesRepoTable2 = observer(function NotesRepoTable2() {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    // FIXME: this should useNamedBlocks and the standard comparator we used? The same one
    // in the search bar.
    const rows: ReadonlyArray<IBlockRepoRow> = React.useMemo(() => (
        blocksStore.namedBlocks.map(block => block.toJSON())
            .map((current): IBlockRepoRow => ({
                text: BlockTextContentUtils.getTextContentMarkdown(current.content),
                created: new Date(current.created),
                id: current.id,
                updated: new Date(current.updated),
            }))
    ), [blocksStore.namedBlocks]);

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

                        {/*<DocRepoTableHead/>*/}

                        {/*<DocRepoContextMenu>*/}
                            {root && (
                                <IntersectionList values={rows}
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
