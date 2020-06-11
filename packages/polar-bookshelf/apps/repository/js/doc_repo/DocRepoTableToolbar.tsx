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
import {AutoBlur} from "./AutoBlur";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import isEqual from "react-fast-compare";

interface IProps {
}

export const DocRepoTableToolbar = React.memo((props: IProps) => {

    const store = useDocRepoStore();
    const callbacks = useDocRepoCallbacks();

    const {rowsPerPage, view, selected, page} = store;
    const {setRowsPerPage, setSelected} = callbacks;

    const handleChangePage = (event: any, newPage: number) => {
        callbacks.setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(rowsPerPage);
    };

    const handleCheckbox = (checked: boolean) => {
        if (checked) {
            setSelected('all')
        } else {
            setSelected('none');
        }
    }

    // FIXME the math here is all wrog, we need the total number of items on
    // the page, and then only teh selected count of items on the page

    return (
        <>
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
                    count={view.length}
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
