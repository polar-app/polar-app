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
import {Tags} from "polar-shared/src/tags/Tags";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";


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

interface IProps {
    readonly viewIndex: number;
    readonly rawContextMenuHandler: ContextMenuHandler;
    readonly selectRow: (index: number, event: React.MouseEvent, type: SelectRowType) => void;
    readonly isSelected: (index: number) => boolean;
    readonly onLoadDoc: (repoDocInfo: RepoDocInfo) => void;
    readonly row: RepoDocInfo;
    readonly selectedProvider: () => ReadonlyArray<RepoDocInfo>;
}

export const DocRepoTableRow = React.memo((props: IProps) => {

    const classes = useStyles();

    const {
        viewIndex, rawContextMenuHandler, selectRow, isSelected,
        onLoadDoc, row, selectedProvider
    } = props;

    const contextMenuHandler: ContextMenuHandler = (event) => {
        props.selectRow(viewIndex, event, 'context');
        rawContextMenuHandler(event);
    };

    const selectRowClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        props.selectRow(viewIndex, event, 'click');
    };

    const isItemSelected = isSelected(viewIndex);
    const labelId = `enhanced-table-checkbox-${viewIndex}`;

    return (
        <TableRow
            hover
            className={classes.tr}
            // onClick={(event) => handleClick(event, row.fingerprint)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.fingerprint}
            onDoubleClick={() => props.onLoadDoc(row)}
            selected={isItemSelected}>

            <TableCell padding="checkbox">
                <AutoBlur>
                    <Checkbox
                        checked={isItemSelected}
                        inputProps={{'aria-labelledby': labelId}}
                        onClick={(event) => props.selectRow(viewIndex, event, 'checkbox')}

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
            <TableCell padding="none"
                       className={classes.colTags}
                       onClick={selectRowClickHandler}
                       onContextMenu={contextMenuHandler}>

                {/*TODO: this sorting and mapping might be better done */}
                {/*at the RepoDocInfo level so it's done once not per*/}
                {/*display render.*/}
                {arrayStream(Tags.onlyRegular(Object.values(row.tags || {})))
                    .sort((a, b) => a.label.localeCompare(b.label))
                    .map(current => current.label)
                    .collect()
                    .join(', ')}

            </TableCell>

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
                                 selectedProvider={selectedProvider}
                                 repoDocInfo={row}
                                 flagged={row.flagged}
                                 archived={row.archived}
                                 onDocDropdown={(event) => props.selectRow(viewIndex, event, 'click')}
                                 onArchived={NULL_FUNCTION}
                                 onFlagged={NULL_FUNCTION}
                                 onTagRequested={NULL_FUNCTION}
                                 onOpen={NULL_FUNCTION}
                                 onRename={NULL_FUNCTION}
                                 onShowFile={NULL_FUNCTION}
                                 onCopyOriginalURL={NULL_FUNCTION}
                                 onDelete={NULL_FUNCTION}
                                 onCopyDocumentID={NULL_FUNCTION}
                                 onCopyFilePath={NULL_FUNCTION}
                />

            </TableCell>

        </TableRow>
    );

});
