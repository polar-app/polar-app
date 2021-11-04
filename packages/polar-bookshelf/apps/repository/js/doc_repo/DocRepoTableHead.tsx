import React from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMN_MAP, CONTEXT_MENU_ICON_WIDTH, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {Sorting} from "./Sorting";
import {useDocRepoCallbacks, useDocRepoStore} from "./DocRepoStore2";
import {useDocRepoColumnsPrefs} from "./DocRepoColumnsPrefsHook";
import {isPresent} from "polar-shared/src/Preconditions";
import {Devices} from "polar-shared/src/util/Devices";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import FlagIcon from '@material-ui/icons/Flag';
import ArchiveIcon from "@material-ui/icons/Archive";
import {DocColumnsSelectorWithPrefs} from "./DocColumnsSelectorWithPrefs";
import {MUIToggleButton} from "../../../../web/js/ui/MUIToggleButton";
import {MUICheckboxIconButton} from "../../../../web/js/mui/MUICheckboxIconButton";
import {SelectionActiveButtons} from "./DocRepoTableToolbar";

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
            width: CONTEXT_MENU_ICON_WIDTH
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
        },
        selectionIconsContainer:{
            display: 'flex',
            flexDirection:'row-reverse',
            paddingRight: '15px',
            marginLeft: 'auto'
        },
        reverseRow:{
            display: 'flex',
            flexDirection: 'row-reverse'
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
        </TableCell>

    );

});

const SelectionOrToggleButtons = React.memo(function SelectionOrToggleButtons() {
    const classes = useStyles();
    const {filters, selected} = useDocRepoStore(['filters', 'selected']);
    const callbacks = useDocRepoCallbacks();

    const {setFilters} = callbacks;

    return(<>
            {selected.length > 0 ?
                <SelectionActiveButtons className={classes.reverseRow}/>
                :
                <div className={classes.selectionIconsContainer}>
                    <MUIToggleButton id="toggle-archived"
                                    iconOnly
                                    tooltip="Toggle archived docs"
                                    size={'small'}
                                    icon={<ArchiveIcon/>}
                                    initialValue={filters.archived}
                                    onChange={(value: any) => setFilters({...filters, archived: value})}/>
                    <MUIToggleButton id="toggle-flagged"
                                    iconOnly
                                    tooltip="Show only flagged docs"
                                    size={'small'}
                                    icon={<FlagIcon/>}
                                    initialValue={filters.flagged}
                                    onChange={(value: any) => setFilters({...filters, flagged: value})}/>
                </div>
            }
        </>);
});

export function useDocRepoColumns() {

    const desktopColumns = useDocRepoColumnsPrefs();
    const mobileColumns: ReadonlyArray<keyof IDocInfo> = ['title'];
    const tabletColumns: ReadonlyArray<keyof IDocInfo> = ['title', 'progress'];

    const selectedColumns = Devices.isDesktop() ? desktopColumns : Devices.isPhone()? mobileColumns : tabletColumns;

    return selectedColumns.map(current => COLUMN_MAP[current])
        .filter(current => isPresent(current));

}

export const DocRepoTableHead = React.memo(function DocRepoTableHead() {

    const classes = useStyles();

    const {order, orderBy} = useDocRepoStore(['order', 'orderBy']);
    const {setSort} = useDocRepoCallbacks();

    const columns = useDocRepoColumns();

    const {view, selected} = useDocRepoStore(['view','selected']);
    const callbacks = useDocRepoCallbacks();

    const {setSelected} = callbacks;

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
                    <TableCell style={{width:'50px'}}>
                        <MUICheckboxIconButton
                            indeterminate={selected.length > 0 && selected.length < view.length}
                            checked={selected.length === view.length && view.length !== 0}
                            onChange={(_event, checked) => handleCheckbox(checked)}/>
                    </TableCell>

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
                        <SelectionButtonsWithinTableCell/>
                    </DeviceRouters.NotDesktop>

                    <DeviceRouters.Desktop>                            
                        {selected.length > 0 ? <SelectionButtonsWithinTableCell/> : <ColumnSelector/>}
                    </DeviceRouters.Desktop>
                </TableRow>
            </TableHead>
    );
});

const SelectionButtonsWithinTableCell = React.memo(function SelectionButtonsWithinTableCell() {
    const classes = useStyles();

    return(
        <TableCell className={classes.th} style={{ display: 'table-cell', width: '200px'}}>
            <SelectionOrToggleButtons/>
        </TableCell>
    );
});
