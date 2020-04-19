import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import TablePagination from "@material-ui/core/TablePagination";

import {
    createStyles,
    lighten,
    makeStyles,
    Theme
} from "@material-ui/core/styles";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {
    MUIDocArchiveButton,
    MUIDocDeleteButton,
    MUIDocFlagButton,
    MUIDocTagButton
} from "./MUIDocButtons";
import {DocActions} from "./DocActions";
import {Provider} from "polar-shared/src/util/Providers";
import {GlobalHotKeys} from "react-hotkeys";
import { AutoBlur } from "./AutoBlur";

const globalKeyMap = {
    TAG: 'd',
    DELETE: 'd',
    FLAG: 'f',
    ARCHIVE: 'a'
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // paddingLeft: theme.spacing(2),
            // paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                    color: theme.palette.secondary.main,
                    backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                }
                : {
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.secondary.dark,
                },
        title: {
            flex: '1 1 100%',
        },
    }),
);

interface IProps extends DocActions.DocToolbar.Callbacks {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly selectedProvider: Provider<ReadonlyArray<RepoDocInfo>>
    readonly numSelected: number;
    readonly page: number;
    readonly rowsOnPage: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
    readonly onSelectAllRows: (selected: boolean) => void;
}

export const EnhancedTableToolbar = (props: IProps) => {
    const classes = useStyles();
    const { numSelected, rowsOnPage, rowsPerPage, page, data } = props;
    const actions = DocActions.createDocToolbar(props.selectedProvider, props);

    const globalKeyHandlers = {
        DELETE: () => actions.onDelete(),
        FLAG: () => actions.onFlagged(),
        ARCHIVE: () => actions.onArchived()
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    // FIXME the math here is all wrog, we need the total number of items on
    // the page, and then only teh selected count of items on the page

    // FIXME: select only per pages or select ALL the pages..

    // const selectedOnPage = sel

    return (
        <>
            <GlobalHotKeys allowChanges={true}
                           keyMap={globalKeyMap}
                           handlers={globalKeyHandlers}/>
            <Grid container
                  direction="row"
                  justify="space-between"
                  alignItems="center">

                <Grid item>

                    <Box pl={1}>

                        <Grid container
                              direction="row"
                              justify="flex-start"
                              alignItems="center">

                            <Grid item>
                                <AutoBlur>
                                    <Checkbox
                                        indeterminate={numSelected > 0 && numSelected < rowsPerPage}
                                        checked={rowsOnPage === rowsPerPage}
                                        onChange={event => props.onSelectAllRows(event.target.checked)}
                                        inputProps={{ 'aria-label': 'select all documents' }}
                                    />
                                </AutoBlur>
                            </Grid>

                            {numSelected > 0 && (
                                <Grid item>
                                    <Grid container
                                          spacing={0}
                                          direction="row"
                                          justify="flex-start"
                                          alignItems="center">

                                        <Grid item>
                                            <MUIDocTagButton onClick={NULL_FUNCTION} size="medium"/>
                                        </Grid>

                                        <Grid item>
                                            <MUIDocArchiveButton onClick={NULL_FUNCTION} size="medium"/>
                                        </Grid>

                                        <Grid item>
                                            <MUIDocFlagButton onClick={NULL_FUNCTION} size="medium"/>
                                        </Grid>

                                        <Divider orientation="vertical" flexItem/>

                                        <Grid item>
                                            <MUIDocDeleteButton size="medium"
                                                                onClick={actions.onDelete}/>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                </Grid>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    size="small"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    style={{
                        padding: 0,
                        minHeight: 0
                    }}
                    // onDoubleClick={event => {
                    //     event.stopPropagation();
                    //     event.preventDefault();
                    // }}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />

            </Grid>
        </>
    );
};
