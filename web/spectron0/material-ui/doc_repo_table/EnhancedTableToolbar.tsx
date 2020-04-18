import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Divider from "@material-ui/core/Divider";
import DeleteIcon from "@material-ui/icons/Delete";
import TablePagination from "@material-ui/core/TablePagination";
import FlagIcon from "@material-ui/icons/Flag";
import ArchiveIcon from "@material-ui/icons/Archive";

import {
    createStyles,
    lighten,
    makeStyles,
    Theme
} from "@material-ui/core/styles";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUIDocFlagButton} from "./MUIDocButtons";

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

interface IProps {
    readonly data: ReadonlyArray<RepoDocInfo>;
    readonly numSelected: number;
    readonly page: number;
    readonly rowsPerPage: number;
    readonly onChangePage: (page: number) => void;
    readonly onChangeRowsPerPage: (rowsPerPage: number) => void;
    readonly onSelectAllRows: (selected: boolean) => void;
}

export const EnhancedTableToolbar = (props: IProps) => {
    const classes = useStyles();
    const { numSelected, rowsPerPage, page, data } = props;

    const handleChangePage = (event: unknown, newPage: number) => {
        props.onChangePage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rowsPerPage = parseInt(event.target.value, 10);
        props.onChangeRowsPerPage(rowsPerPage);

    };

    const rowCount = data.length;

    return (
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
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                // onChange={onSelectAllClick}
                                onChange={event => props.onSelectAllRows(event.target.checked)}
                                inputProps={{ 'aria-label': 'select all documents' }}
                            />
                        </Grid>

                        {numSelected > 0 && (
                            <Grid item>
                                <Grid container
                                      spacing={0}
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="center">

                                    <Grid item>
                                        <Tooltip title="Tag">
                                            <IconButton size="medium">
                                                <LocalOfferIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                    <Grid item>
                                        <Tooltip title="Archive">
                                            <IconButton size="medium">
                                                <ArchiveIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>

                                    <Grid item>
                                        <MUIDocFlagButton onClick={NULL_FUNCTION} size="medium"/>
                                    </Grid>

                                    <Divider orientation="vertical" flexItem/>

                                    <Grid item>
                                        <Tooltip title="Delete">
                                            <IconButton aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
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

        // <Toolbar
        //     className={clsx(classes.root, {
        //         [classes.highlight]: numSelected > 0,
        //     })}
        // >
        //     {numSelected > 0 ? (
        //         <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
        //             {numSelected} selected
        //         </Typography>
        //     ) : (
        //         <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        //             Nutrition
        //         </Typography>
        //     )}
        //     {numSelected > 0 && (
        //         <div style={{display: 'flex'}}>
        //             <Tooltip title="Tag">
        //                 <IconButton>
        //                     <LocalOfferIcon color="primary"/>
        //                 </IconButton>
        //             </Tooltip>
        //
        //             <Tooltip title="Delete">
        //                 <IconButton aria-label="delete">
        //                     <DeleteIcon />
        //                 </IconButton>
        //             </Tooltip>
        //         </div>
        //     )}
        // </Toolbar>
    );
};
