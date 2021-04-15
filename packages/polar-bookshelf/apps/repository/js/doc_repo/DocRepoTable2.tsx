import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import {DocRepoTableToolbar} from './DocRepoTableToolbar';
import {DocRepoTableHead} from "./DocRepoTableHead";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {
    BlockComponentProps, HiddenBlockComponentProps,
    IntersectionList,
    VisibleComponentProps
} from "../../../../web/js/intersection_list/IntersectionList";
import { RepoDocInfo } from '../RepoDocInfo';
import TableRow from '@material-ui/core/TableRow';
import {Numbers} from "polar-shared/src/util/Numbers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {createContextMenu} from "./MUIContextMenu2";
import {
    IDocViewerContextMenuOrigin
} from "../../../doc/src/DocViewerMenu";
import {MUIDocDropdownMenuItems} from "./MUIDocDropdownMenuItems";

const VisibleComponent = React.memo(function VisibleComponent(props: VisibleComponentProps<RepoDocInfo>) {

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

const BlockComponent = React.memo(function BlockComponent(props: BlockComponentProps<RepoDocInfo>) {

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

const HiddenBlockComponent = React.memo(function HiddenBlockComponent(props: HiddenBlockComponentProps<RepoDocInfo>) {

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

export const DocRepoTable2 = deepMemo(() => {

    const {view} = useDocRepoStore(['view']);

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
                                    flexGrow: 1
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
                                                  BlockComponent={BlockComponent}
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
