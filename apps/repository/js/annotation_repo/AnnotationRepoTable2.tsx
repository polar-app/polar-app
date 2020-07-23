import * as React from 'react';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import Divider from "@material-ui/core/Divider";
import isEqual from "react-fast-compare";
import {
    useAnnotationRepoCallbacks,
    useAnnotationRepoStore
} from './AnnotationRepoStore';
import {AnnotationRepoTableRow} from "./AnnotationRepoTableRow";
import {createContextMenu} from "../doc_repo/MUIContextMenu";
import {AnnotationRepoTableMenu} from "./AnnotationRepoTableMenu";
import {MUINextIconButton} from "../../../../web/js/mui/icon_buttons/MUINextIconButton";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {DeviceRouter, DeviceRouters} from '../../../../web/js/ui/DeviceRouter';
import {MUIPrevIconButton} from "../../../../web/js/mui/icon_buttons/MUIPrevIconButton";

interface ToolbarProps {
    readonly nrRows: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
}

// TODO: move to a dedicated component
const Toolbar = React.memo((props: ToolbarProps) => {

    // TODO: don't use props for callbacks...

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    return (
        <DeviceRouter.Desktop>
            <>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    size="small"
                    count={props.nrRows}
                    rowsPerPage={props.rowsPerPage}
                    style={{
                        padding: 0,
                        overflow: "hidden",
                        minHeight: '4.5em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}
                    // onDoubleClick={event => {
                    //     event.stopPropagation();
                    //     event.preventDefault();
                    // }}
                    page={props.page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

                <Divider orientation="horizontal"/>

            </>
        </DeviceRouter.Desktop>
    );

}, isEqual);

namespace Handheld {

    export const PrevPage = React.memo(() => {

        const {page} = useAnnotationRepoStore(['page']);
        const {setPage} = useAnnotationRepoCallbacks();

        if (page <= 0) {
            return null;
        }

        return (
            <DeviceRouters.Handheld>
                <MUIPrevIconButton color='secondary'
                                   onClick={() => setPage(page - 1)}/>
            </DeviceRouters.Handheld>
        );

    });

    export const NextPage = React.memo(() => {

        const {page, rowsPerPage, view} = useAnnotationRepoStore(['page', 'rowsPerPage', 'view']);
        const {setPage} = useAnnotationRepoCallbacks();

        const nrPages = view.length / rowsPerPage;

        if (page === nrPages) {
            return null;
        }

        return (
            <DeviceRouters.Handheld>
                <MUINextIconButton color='secondary'
                                   onClick={() => setPage(page + 1)}/>
            </DeviceRouters.Handheld>
        );

    });

}

export const AnnotationRepoTable2 = React.memo(() => {

    const {page, rowsPerPage, view, viewPage, selected} =
        useAnnotationRepoStore(['page', 'rowsPerPage', 'view', 'viewPage', 'selected']);

    const {setPage, setRowsPerPage} = useAnnotationRepoCallbacks();

    const ContextMenu = React.useMemo(() => createContextMenu(AnnotationRepoTableMenu), []);

    return (

        <ContextMenu>
            <Paper className="AnnotationRepoTable2"
                   square id="doc-repo-table"
                   elevation={0}
                   style={{
                       display: 'flex',
                       flexDirection: 'column',
                       minHeight: 0,
                       flexGrow: 1
                   }}>

                <Toolbar nrRows={view.length}
                         rowsPerPage={rowsPerPage}
                         page={page}
                         onChangePage={setPage}
                         onChangeRowsPerPage={setRowsPerPage}/>

                <div id="doc-table"
                     className="AnnotationRepoTable2.Body"
                     style={{
                         display: 'flex',
                         flexDirection: 'column',
                         minHeight: 0,
                         flexGrow: 1,
                         overflow: 'auto'
                     }}>

                    <Handheld.PrevPage/>

                    <TableContainer style={{
                                        flexGrow: 1,
                                        overflow: 'auto'
                                    }}>

                        <Table stickyHeader
                               style={{
                                   minWidth: 0,
                                   maxWidth: '100%',
                                   tableLayout: 'fixed'
                               }}
                               aria-labelledby="tableTitle"
                               size={'medium'}
                               aria-label="enhanced table">

                            <TableBody>

                                {viewPage.map((annotation, index) => {

                                        const viewIndex = (page * rowsPerPage) + index;
                                        const rowSelected = selected.includes(annotation.id);
                                        return (
                                            <AnnotationRepoTableRow key={annotation.id}
                                                                    viewIndex={viewIndex}
                                                                    rowSelected={rowSelected}
                                                                    annotation={annotation}/>
                                        );

                                    })}

                            </TableBody>

                        </Table>
                    </TableContainer>

                    <Handheld.NextPage/>

                </div>

            </Paper>
        </ContextMenu>

    );
});
