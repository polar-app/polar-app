import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {AutoBlur} from "./AutoBlur";
import Checkbox from "@material-ui/core/Checkbox";
import {DateTimeTableCell} from "../../../../apps/repository/js/DateTimeTableCell";
import {MUIDocButtonBar} from "./MUIDocButtonBar";
import {ContextMenuHandler} from "./MUIDocContextMenu";
import {SelectRowType} from "../../../../apps/repository/js/doc_repo/DocRepoScreen";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMN_MAP, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {RepoDocInfo} from "../../../../apps/repository/js/RepoDocInfo";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tags, Tag} from "polar-shared/src/tags/Tags";
import {Callback1, NULL_FUNCTION} from "polar-shared/src/util/Functions";
import isEqual from "react-fast-compare";
import {DocActions} from "./DocActions";
import {DeepEquals} from "./DeepEquals";
import debugIsEqual = DeepEquals.debugIsEqual;
import {
    useDocRepoActions, useDocRepoCallbacks,
    useDocRepoStore
} from "../../../../apps/repository/js/doc_repo/DocRepoStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '100%',
        },
        paper: {
            width: '100%',
            height: '100%',
            // marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 0,
            maxWidth: '100%',
            tableLayout: 'fixed'
        },
        tr: {
            // borderSpacing: '100px'
        },
        td: {
            whiteSpace: 'nowrap'
        },
        progress: {
            width: COLUMN_MAP.progress.width
        },
        colProgress: {
            width: COLUMN_MAP.progress.width,
            minWidth: COLUMN_MAP.progress.width
        },
        colAdded: {
            whiteSpace: 'nowrap',
            width: COLUMN_MAP.added.width,
        },
        colLastUpdated: {
            whiteSpace: 'nowrap',
            width: COLUMN_MAP.lastUpdated.width,
        },
        colTitle: {
            width: COLUMN_MAP.title.width,

            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },
        colTags: {
            width: COLUMN_MAP.tags.width,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },
        colDocButtons: {
            width: DOC_BUTTON_COLUMN_WIDTH
        },
        docButtons: {
            marginLeft: '5px',
            marginRight: '5px',
            display: 'flex',
            justifyContent: 'flex-end'
        }

    }),
);

interface TableCellTagsProps {
    readonly contextMenuHandler: ContextMenuHandler;
    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;
    readonly viewIndex: number;
    readonly tags?: Readonly<{[id: string]: Tag}>;
}

export const TableCellTags = React.memo((props: TableCellTagsProps) => {

    const classes = useStyles();

    return (
        <TableCell padding="none"
                   className={classes.colTags}
                   onClick={event => props.selectRow(props.viewIndex, event, 'click')}
                   onContextMenu={props.contextMenuHandler}>

            {/*TODO: this sorting and mapping might be better done */}
            {/*at the RepoDocInfo level so it's done once not per*/}
            {/*display render.*/}
            {arrayStream(Tags.onlyRegular(Object.values(props.tags || {})))
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(current => current.label)
                .collect()
                .join(', ')}

        </TableCell>
    );
}, isEqual);

interface IProps {

    readonly viewIndex: number;
    readonly rawContextMenuHandler: ContextMenuHandler;
    readonly selected: boolean;
    readonly row: RepoDocInfo;


    readonly onDragStart?: () => void;
    readonly onDragEnd?: () => void;

}

// FIXME: enter keyboard command should open the current row...


// FIXME: this is the problem, we're re-rendering each row again
export const DocRepoTableRow = React.memo((props: IProps) => {

    const classes = useStyles();

    const actions = useDocRepoActions();
    const callbacks = useDocRepoCallbacks();

    const {selectRow} = actions;
    const {viewIndex, rawContextMenuHandler, selected, row} = props;

    const contextMenuHandler: ContextMenuHandler = (event) => {
        selectRow(viewIndex, event, 'context');
        rawContextMenuHandler(event);
    };

    const selectRowClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        selectRow(viewIndex, event, 'click');
    };

    const labelId = `enhanced-table-checkbox-${viewIndex}`;

    return (
        <TableRow
            hover
            className={classes.tr}
            role="checkbox"
            aria-checked={selected}
            draggable
            onDragStart={callbacks.onDragStart}
            onDragEnd={callbacks.onDragEnd}
            tabIndex={props.viewIndex}
            onDoubleClick={callbacks.onOpen}
            selected={selected}>

            <TableCell padding="checkbox">
                <AutoBlur>
                    <Checkbox
                        checked={selected}
                        inputProps={{'aria-labelledby': labelId}}
                        onClick={(event) => selectRow(viewIndex, event, 'checkbox')}

                    />
                </AutoBlur>
            </TableCell>
            <TableCell component="th"
                       id={labelId}
                       scope="row"
                       className={classes.colTitle}
                       padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>
                {row.title}
            </TableCell>
            <TableCell className={classes.colAdded}
                       padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                <DateTimeTableCell datetime={row.added}/>

            </TableCell>
            <TableCell className={classes.colLastUpdated}
                       padding="none"
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                <DateTimeTableCell datetime={row.lastUpdated}/>

            </TableCell>

            <TableCellTags contextMenuHandler={contextMenuHandler}
                           selectRow={selectRow}
                           viewIndex={viewIndex}
                           tags={row.tags}/>

            <TableCell className={classes.colProgress}
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}
                       padding="none">

                <progress className={classes.progress}
                          value={row.progress}
                          max={100}/>

            </TableCell>

            <TableCell align="right"
                       padding="none"
                       className={classes.colDocButtons}
                       onClick={event => event.stopPropagation()}
                       onDoubleClick={event => event.stopPropagation()}>

                <MUIDocButtonBar className={classes.docButtons}
                                 flagged={row.flagged}
                                 archived={row.archived}
                                 viewIndex={viewIndex}
                                 {...props}/>

            </TableCell>

        </TableRow>
    );

}, isEqual);
