import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import {Numbers} from "polar-shared/src/util/Numbers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useNamedBlocks} from "./NoteUtils";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {
    BlockComponentProps,
    HiddenBlockComponentProps,
    IntersectionList,
    VisibleComponentProps
} from '../intersection_list/IntersectionList';
import {DocRepoTableHead} from "../../../apps/repository/js/doc_repo/DocRepoTableHead";

const VisibleComponent = React.memo(function VisibleComponent(props: VisibleComponentProps<IBlock>) {

    const {selected} = useDocRepoStore(['selected']);

    const viewIndex = props.index;
    const row = props.value;

    return (
        <DocRepoTableRow
            viewIndex={viewIndex}
            key={viewIndex}
            rawContextMenuHandler={NULL_FUNCTION}
            selected={selected.includes(row.id)}
            row={row}
        />
    );

});

const DocRepoBlockComponent = React.memo(function DocRepoBlockComponent(props: BlockComponentProps<IBlock>) {

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

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<IBlock>) {

    const height = Numbers.sum(...props.values.map(current => HEIGHT));

    return (
        <TableRow style={{
            minHeight: `${height}px`,
            height: `${height}px`,
        }}>

        </TableRow>
    );

});

export const [DocRepoContextMenu, useDocRepoContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(MUIDocDropdownMenuItems, {name: 'doc-repo'});

export const NotesRepoTable2 = deepMemo(() => {

    const {view} = useDocRepoStore(['view']);

    const namedBlocks = useNamedBlocks({ sort: true });

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

                <DocRepoTableToolbar />

                <TableContainer ref={setRoot}
                                style={{
                                    flexGrow: 1,
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

                        <DocRepoTableHead/>

                        <DocRepoContextMenu>
                            {root && (
                                <IntersectionList values={view}
                                                  root={root}
                                                  blockSize={25}
                                                  BlockComponent={DocRepoBlockComponent}
                                                  HiddenBlockComponent={HiddenBlockComponent}
                                                  VisibleComponent={VisibleComponent}/>)}
                        </DocRepoContextMenu>

                    </Table>
                </TableContainer>
            </>

        </MUIElevation>
    );

});

const HEIGHT = 40;
