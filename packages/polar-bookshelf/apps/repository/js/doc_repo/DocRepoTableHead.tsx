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
import FlagIcon from '@material-ui/icons/Flag';
import { DocColumnsSelectorWithPrefs } from "./DocColumnsSelectorWithPrefs";
import { MUIToggleButton } from "polar-bookshelf/web/js/ui/MUIToggleButton";
import { MUICheckboxIconButton } from "polar-bookshelf/web/js/mui/MUICheckboxIconButton";

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

    const mobileColumns: ReadonlyArray<keyof IDocInfo> = ['title'];

    const tabletColumns: ReadonlyArray<keyof IDocInfo> = ['title', 'progress'];

    const selectedColumns = Devices.isDesktop() ? desktopColumns : Devices.isPhone()? mobileColumns : tabletColumns;

    const columns = selectedColumns.map(current => COLUMN_MAP[current])
                                   .filter(current => isPresent(current));

    const {view, filters, selected} = useDocRepoStore(['view', 'filters', 'selected']);
    const callbacks = useDocRepoCallbacks();

    const {setFilters, setSelected} = callbacks;

    const handleCheckbox = React.useCallback((checked: boolean) => {
        // TODO: this is wrong... the '-' button should remove the checks...
        // just like gmail.
        if (checked) {
            setSelected('all')
        } else {
            setSelected('none');
        }
    }, [setSelected]);

    return (

            <TableHead className={classes.root}>
                <TableRow className={classes.row}>
                    <MUICheckboxIconButton
                            indeterminate={selected.length > 0 && selected.length < view.length}
                            checked={selected.length === view.length && view.length !== 0}
                            onChange={(event, checked) => handleCheckbox(checked)}/>                    
                    <DeviceRouter.Desktop>
                        <Check/>
                    </DeviceRouter.Desktop>
                    
                    {columns.map((column) => {

                        const newOrder = orderBy === column.id ? Sorting.reverse(order) : column.defaultOrder;

                        return (
                            <TableCell key={column.id}
                                       className={classes.th}
                                       style={{
                                           width: column.id==='progress' ? '85px': column.width,
                                           minWidth: column.id==='progress' ? '85px': column.width
                                       }}
                                       padding={column.disablePadding ? 'none' : 'default'}
                                       sortDirection={orderBy === column.id ? order : false}>

                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    hideSortIcon
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
                    <DeviceRouters.NotDesktop>
                        <MUIToggleButton id="toggle-flagged"
                                        tooltip="Show only flagged docs"
                                        size="small"
                                        label="Flagged"
                                        icon={<FlagIcon/>}
                                        initialValue={filters.flagged}
                                        onChange={(value: any) => setFilters({...filters, flagged: value})}/>
                    </DeviceRouters.NotDesktop>
                    <DeviceRouters.NotDesktop>
                        <MUIToggleButton id="toggle-archived"
                                        tooltip="Toggle archived docs"
                                        size="small"
                                        label="Archived"
                                        initialValue={filters.archived}
                                        onChange={(value: any) => setFilters({...filters, archived: value})}/>
                    </DeviceRouters.NotDesktop>

                    <DeviceRouter.Desktop>
                        <>
                            <ColumnSelector/>
                        </>
                    </DeviceRouter.Desktop>

                    <DeviceRouters.NotDesktop>
                        <TableCell style={{width: '45px'}}>
                        </TableCell>
                    </DeviceRouters.NotDesktop>

                </TableRow>
            </TableHead>
    );
});
