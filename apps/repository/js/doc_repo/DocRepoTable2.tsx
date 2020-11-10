import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import {DocRepoTableToolbar} from './DocRepoTableToolbar';
import {DocRepoTableHead} from "./DocRepoTableHead";
import {MUIDocContextMenu} from "./MUIDocContextMenu";
import {DocRepoTableRow} from "./DocRepoTableRow";
import {useDocRepoStore} from "./DocRepoStore2";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import {MUIElevation} from "../../../../web/js/mui/MUIElevation";
import {
    BlockComponentProps,
    HiddenComponentProps, IntersectionList,
    VisibleComponentProps
} from "../../../../web/js/intersection_list/IntersectionList";
import { RepoDocInfo } from '../RepoDocInfo';
import TableRow from '@material-ui/core/TableRow';
import {Numbers} from "polar-shared/src/util/Numbers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const DocRepoTable2 = deepMemo(() => {

    const {page, rowsPerPage, viewPage, view, selected}
        = useDocRepoStore(['page', 'rowsPerPage', 'view', 'viewPage', 'selected']);

    const [root, setRoot] = React.useState<HTMLElement | HTMLDivElement | null>();

    const HiddenComponent = React.memo((props: HiddenComponentProps<RepoDocInfo>) => {

        const height = HEIGHT;

        return (
            <TableRow style={{
                minHeight: `${height}px`,
                height: `${height}px`,
            }}>

            </TableRow>
        );

    });

    const VisibleComponent = React.memo((props: VisibleComponentProps<RepoDocInfo>) => {

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

    const BlockComponent = React.memo((props: BlockComponentProps<RepoDocInfo>) => {

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

    return (
        <div style={{
                width: '100%',
                height: '100%'
             }}>

            <MUIElevation elevation={2}
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

                            {root && (
                                <IntersectionList values={view}
                                                  root={root}
                                                  blockComponent={BlockComponent}
                                                  hiddenComponent={HiddenComponent}
                                                  visibleComponent={VisibleComponent}/>)}

                            {/*<TableBody>*/}
                            {/*    {viewPage*/}
                            {/*        .map((row, index) => {*/}

                            {/*            const viewIndex = (page * rowsPerPage) + index;*/}

                            {/*            return (*/}
                            {/*                <DocRepoTableRow*/}
                            {/*                    viewIndex={viewIndex}*/}
                            {/*                    key={viewIndex}*/}
                            {/*                    rawContextMenuHandler={rawContextMenuHandler}*/}
                            {/*                    selected={selected.includes(row.id)}*/}
                            {/*                    row={row}*/}
                            {/*                />*/}
                            {/*            );*/}
                            {/*        })}*/}
                            {/*</TableBody>*/}
                        </Table>
                    </TableContainer>
                </>

            </MUIElevation>
        </div>
    )

});

const HEIGHT = 40;
