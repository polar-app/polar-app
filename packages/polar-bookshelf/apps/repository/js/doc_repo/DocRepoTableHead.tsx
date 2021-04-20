import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMN_MAP, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {Sorting} from "./Sorting";
import {
    useDocRepoStore, useDocRepoCallbacks
} from "./DocRepoStore2";
import {useDocRepoColumnsPrefs} from "./DocRepoColumnsPrefsHook";
import {isPresent} from "polar-shared/src/Preconditions";
import {Devices} from "polar-shared/src/util/Devices";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DeviceRouter, DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import FilterListIcon from '@material-ui/icons/FilterList';
import { DocColumnsSelectorWithPrefs } from "./DocColumnsSelectorWithPrefs";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.default
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
        th: {
            whiteSpace: 'nowrap',
        },
        row: {
            "& th": {
                paddingTop: theme.spacing(1),
                paddingBottom: theme.spacing(1),
                paddingLeft: 0,
                paddingRight: 0,
                borderCollapse: 'collapse',
                lineHeight: '1em'
            }
        }
    }),
);

const Check = React.memo(function Check() {
    return (
        <TableCell key="left-checkbox"
                   padding="checkbox">
        </TableCell>
    )
});

const ColumnSelector = React.memo(function ColumnSelector() {
    return (

        <TableCell key="right-filter"
                   style={{
                       width: DOC_BUTTON_COLUMN_WIDTH,
                   }}>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <DocColumnsSelectorWithPrefs/>

            </div>
            {/*<FilterListIcon/>*/}
        </TableCell>

    );

});

export const DocRepoTableHead = React.memo(function DocRepoTableHead() {

    const classes = useStyles();

    const {order, orderBy} = useDocRepoStore(['order', 'orderBy']);
    const {setSort} = useDocRepoCallbacks();
    const desktopColumns = useDocRepoColumnsPrefs();

    const mobileColumns: ReadonlyArray<keyof IDocInfo> = ['title', 'progress'];

    const selectedColumns = Devices.isDesktop() ? desktopColumns : mobileColumns;

    const columns = selectedColumns.map(current => COLUMN_MAP[current])
                                   .filter(current => isPresent(current));

    return (

            <TableHead className={classes.root}>
                <TableRow className={classes.row}>

                    <Check/>

                    {columns.map((column) => {

                        const newOrder = orderBy === column.id ? Sorting.reverse(order) : column.defaultOrder;

                        return (
                            <TableCell key={column.id}
                                       className={classes.th}
                                       style={{
                                           width: column.width,
                                           minWidth: column.width
                                       }}
                                       padding={column.disablePadding ? 'none' : 'default'}
                                       sortDirection={orderBy === column.id ? order : false}>

                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={() => setSort(newOrder, column.id)}>
                                    {column.label}
                                    {orderBy === column.id ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        )
                    })}

                    <DeviceRouter.Desktop>
                        <>
                            <ColumnSelector/>
                        </>
                    </DeviceRouter.Desktop>

                    <DeviceRouters.NotDesktop>
                        <TableCell style={{width: '35px'}}>
                        </TableCell>
                    </DeviceRouters.NotDesktop>

                </TableRow>
            </TableHead>
    );
});
