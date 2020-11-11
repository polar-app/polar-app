import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {AutoBlur} from "./AutoBlur";
import Checkbox from "@material-ui/core/Checkbox";
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
import {DocRepoTableRowInner} from "./DocRepoTableRowInner";
import { useDocRepoContextMenu } from "./DocRepoTable2";
import {useMUIHoverListener} from "../../../../web/js/mui/MUIHoverStore";

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

    }),
);

interface IProps {
    readonly viewIndex: number;
    readonly rawContextMenuHandler: ContextMenuHandler;
    readonly selected: boolean;
    readonly row: RepoDocInfo;
    readonly style?: React.CSSProperties;
}

export const DocRepoTableRow = React.memo((props: IProps) => {

    const classes = useStyles();

    const callbacks = useDocRepoCallbacks();

    const {selectRow} = callbacks;
    const {viewIndex, selected, row} = props;

    const labelId = `enhanced-table-checkbox-${viewIndex}`;
    const contextMenuHandlers = useDocRepoContextMenu();

    const hoverListener = useMUIHoverListener();

    return (
        <TableRow
            {...contextMenuHandlers}
            {...hoverListener}
            style={props.style}
            hover
            className={classes.tr}
            role="checkbox"
            aria-checked={selected}
            draggable
            onDragStart={callbacks.onDragStart}
            onDragEnd={callbacks.onDragEnd}
            // tabIndex={1}
            // onFocus={() => setSelected([viewIndex])}
            onDoubleClick={callbacks.onOpen}
            selected={selected}>

            <TableCell padding="none">
                <AutoBlur>
                    <Checkbox
                        checked={selected}
                        inputProps={{'aria-labelledby': labelId}}
                        onClick={(event) => selectRow(row.id, event, 'checkbox')}

                    />
                </AutoBlur>
            </TableCell>

            <DocRepoTableRowInner viewIndex={props.viewIndex}
                                  rawContextMenuHandler={props.rawContextMenuHandler}
                                  row={props.row}/>

        </TableRow>
    );

}, isEqual);
