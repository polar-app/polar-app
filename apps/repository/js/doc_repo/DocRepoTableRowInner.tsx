import React from "react";
import TableCell from "@material-ui/core/TableCell";
import {DateTimeTableCell} from "../DateTimeTableCell";
import {MUIDocButtonBar} from "./MUIDocButtonBar";
import {ContextMenuHandler} from "./MUIDocContextMenu";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {COLUMN_MAP, DOC_BUTTON_COLUMN_WIDTH} from "./Columns";
import {RepoDocInfo} from "../RepoDocInfo";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import isEqual from "react-fast-compare";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import {IDStr} from "polar-shared/src/util/Strings";
import {SelectRowType} from "./SelectionEvents2";
import {DeviceRouters} from "../../../../web/js/ui/DeviceRouter";
import {useDocRepoColumnsPrefs} from "./DocRepoColumnsPrefsHook";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {AutoBlur} from "./AutoBlur";
import Checkbox from "@material-ui/core/Checkbox";

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
        colAuthors: {
            width: COLUMN_MAP.authors.width,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            textOverflow: 'ellipsis'
        },
        colDocButtons: {
            width: DOC_BUTTON_COLUMN_WIDTH,
        },
        docButtons: {
            display: 'flex',
            justifyContent: 'center'
        }

    }),
);

interface TableCellTagsProps {
    readonly contextMenuHandler: ContextMenuHandler;
    readonly selectRow: (viewID: IDStr, event: React.MouseEvent, type: SelectRowType) => void;
    readonly viewID: IDStr;
    readonly tags?: Readonly<{[id: string]: Tag}>;
}

export const TableCellTags = React.memo((props: TableCellTagsProps) => {

    const classes = useStyles();

    return (
        <TableCell padding="none"
                   className={classes.colTags}
                   onClick={event => props.selectRow(props.viewID, event, 'click')}
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
    readonly row: RepoDocInfo;
    readonly style?: React.CSSProperties;
}

export const DocRepoTableRowInner = React.memo((props: IProps) => {

    const classes = useStyles();

    const callbacks = useDocRepoCallbacks();

    const {selectRow} = callbacks;
    const {viewIndex, rawContextMenuHandler, row} = props;

    const contextMenuHandler: ContextMenuHandler = React.useCallback((event) => {
        selectRow(row.id, event, 'context');
        rawContextMenuHandler(event);
    }, [selectRow, row.id, rawContextMenuHandler]);

    const selectRowClickHandler = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
        selectRow(row.id, event, 'click');
    }, [row.id, selectRow]);

    const labelId = `enhanced-table-checkbox-${viewIndex}`;
    const columns = useDocRepoColumnsPrefs();

    const toCell = React.useCallback((id: keyof IDocInfo) => {

        switch(id) {

            case 'title':
                return (
                    <TableCell key={id}
                               component="th"
                               id={labelId}
                               scope="row"
                               className={classes.colTitle}
                               padding="none"
                               onClick={selectRowClickHandler}
                               onContextMenu={contextMenuHandler}>
                        {row.title}
                    </TableCell>
                );

            case 'added':
                return (
                    <DeviceRouters.NotPhone key={id}>
                        <TableCell className={classes.colAdded}
                                   padding="none"
                                   onClick={selectRowClickHandler}
                                   onContextMenu={contextMenuHandler}>

                            <DateTimeTableCell datetime={row.added}/>

                        </TableCell>
                    </DeviceRouters.NotPhone>
                );

            case 'lastUpdated':
                return (
                    <DeviceRouters.NotPhone key={id}>
                        <TableCell className={classes.colLastUpdated}
                                   padding="none"
                                   onClick={selectRowClickHandler}
                                   onContextMenu={contextMenuHandler}>

                            <DateTimeTableCell datetime={row.lastUpdated}/>

                        </TableCell>
                    </DeviceRouters.NotPhone>
                );

            case 'tags':
                return (
                    <DeviceRouters.NotPhone key={id}>
                        <TableCellTags contextMenuHandler={contextMenuHandler}
                                       selectRow={selectRow}
                                       viewID={row.id}
                                       tags={row.tags}/>
                    </DeviceRouters.NotPhone>
                );

            case 'authors':

                return (
                    <DeviceRouters.NotPhone key={id}>
                        <TableCell padding="none"
                                   className={classes.colAuthors}
                                   onClick={selectRowClickHandler}
                                   onContextMenu={contextMenuHandler}>

                            {Object.values(row.docInfo.authors || {}).join(', ')}

                        </TableCell>
                    </DeviceRouters.NotPhone>
                );

            case 'progress':



                return (
                    <cells.Progress key={id}
                                    progress={row.progress}
                                    selectRowClickHandler={selectRowClickHandler}
                                    contextMenuHandler={contextMenuHandler}/>
                );

            default:
                return (
                    <DeviceRouters.NotPhone key={id}>
                        <TableCell className={classes.colProgress}
                                   onClick={selectRowClickHandler}
                                   onContextMenu={contextMenuHandler}
                                   padding="none"
                                   style={{
                                       width: COLUMN_MAP[id].width,
                                       overflow: 'hidden',
                                       whiteSpace: 'nowrap',
                                       textOverflow: 'ellipsis'
                                   }}>

                            {row.docInfo[id]}

                        </TableCell>
                    </DeviceRouters.NotPhone>
                );
        }

    }, [classes, contextMenuHandler, labelId, row, selectRow, selectRowClickHandler]);

    return (
        <>

            {columns.map(toCell)}

            <DeviceRouters.NotPhone>
                <TableCell align="right"
                           padding="none"
                           className={classes.colDocButtons}
                           onClick={event => event.stopPropagation()}
                           onDoubleClick={event => event.stopPropagation()}>

                    <MUIDocButtonBar className={classes.docButtons}
                                     flagged={row.flagged}
                                     archived={row.archived}
                                     viewID={row.id}/>

                    {/*<cells.OverflowMenuButton viewID={row.id}/>*/}



                </TableCell>
            </DeviceRouters.NotPhone>
        </>
    );

}, isEqual);

export namespace cells {

    interface CheckboxProps {
        readonly viewID: string;
        readonly viewIndex: number;
        readonly selected: boolean;
    }

    export const Check = React.memo((props: CheckboxProps) => {

        const {viewID, viewIndex, selected} = props;
        const {selectRow} = useDocRepoCallbacks();

        const labelId = `enhanced-table-checkbox-${viewIndex}`;

        return (
            <TableCell padding="none">
                <AutoBlur>
                    <Checkbox checked={selected}
                              inputProps={{'aria-labelledby': labelId}}
                              onClick={(event) => selectRow(viewID, event, 'checkbox')}

                    />
                </AutoBlur>
            </TableCell>
        );

    })

    interface ProgressProps {
        readonly progress: number;
        readonly contextMenuHandler: ContextMenuHandler;
        readonly selectRowClickHandler: (event: React.MouseEvent<HTMLElement>) => void;
    }

    export const Progress = React.memo((props: ProgressProps) => {

        const classes = useStyles();

        return (
            <DeviceRouters.NotPhone>
                <TableCell className={classes.colProgress}
                           onClick={props.selectRowClickHandler}
                           onContextMenu={props.contextMenuHandler}
                           padding="none">

                    <progress className={classes.progress}
                              value={props.progress}
                              max={100}/>

                </TableCell>
            </DeviceRouters.NotPhone>
        );

    });

}