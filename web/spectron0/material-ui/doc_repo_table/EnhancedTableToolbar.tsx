import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import TablePagination from "@material-ui/core/TablePagination";
import {
    MUIDocArchiveButton,
    MUIDocDeleteButton,
    MUIDocFlagButton,
    MUIDocTagButton
} from "./MUIDocButtons";
import {GlobalHotKeys} from "react-hotkeys";
import {AutoBlur} from "./AutoBlur";
import {
    useDocRepoActions,
    useDocRepoCallbacks,
    useDocRepoStore
} from "../../../../apps/repository/js/doc_repo/DocRepoStore";
import isEqual from "react-fast-compare";
import {Numbers} from "polar-shared/src/util/Numbers";

// FIXME:  delete doesn't work.

const globalKeyMap = {
    TAG: 't',
    DELETE: ['d', 'del'],
    FLAG: 'f',
    ARCHIVE: 'a'
};

interface IProps {
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
    readonly onSelectAllRows: (selected: boolean) => void;
}

export const EnhancedTableToolbar = React.memo((props: IProps) => {

    // FIXME: consider using a HOC to skip re-rendering when these contexts
    // change.
    const store = useDocRepoStore();
    const actions = useDocRepoActions();
    const callbacks = useDocRepoCallbacks();

    // FIXME this is where mobx would rock because only these two variables
    // would be re-rendered.

    // FIXME: the only other thing I have to do is fix callbacks here so that
    // it's not rendered too often...
    const {rowsPerPage, viewPage, data, selected, page} = store;
    const {setRowsPerPage, setSelected} = actions;

    // FIXME: migrate these to callbacks that use getSelected...

    const globalKeyHandlers = {
        TAG: callbacks.onTagged,
        DELETE: callbacks.onDeleted,
        FLAG: callbacks.onFlagged,
        ARCHIVE: callbacks.onArchived
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(rowsPerPage);
    };

    const handleCheckbox = (checked: boolean) => {
        if (checked) {
            setSelected(Numbers.range(0, rowsPerPage - 1))
        } else {
            setSelected([]);
        }
    }

    // FIXME the math here is all wrog, we need the total number of items on
    // the page, and then only teh selected count of items on the page

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
                              spacing={1}
                              direction="row"
                              justify="flex-start"
                              alignItems="center">

                            <Grid item>
                                <AutoBlur>
                                    <Checkbox
                                        size="medium"
                                        indeterminate={selected.length > 0 && selected.length < rowsPerPage}
                                        checked={selected.length === rowsPerPage}
                                        onChange={event => handleCheckbox(event.target.checked)}
                                        inputProps={{ 'aria-label': 'select all documents' }}
                                    />
                                </AutoBlur>
                            </Grid>

                            {selected.length > 0 && (
                                <>
                                    <Grid item>
                                        <MUIDocTagButton onClick={callbacks.onTagged} size="medium"/>
                                    </Grid>

                                    <Grid item>
                                        <MUIDocArchiveButton onClick={callbacks.onArchived} size="medium"/>
                                    </Grid>

                                    <Grid item>
                                        <MUIDocFlagButton onClick={callbacks.onFlagged} size="medium"/>
                                    </Grid>

                                     <Divider orientation="vertical" variant="middle" flexItem/>

                                    <Grid item>
                                        <MUIDocDeleteButton size="medium"
                                                            onClick={callbacks.onDeleted}/>
                                    </Grid>
                                </>
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
}, isEqual);
