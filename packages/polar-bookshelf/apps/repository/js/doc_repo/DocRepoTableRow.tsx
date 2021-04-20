import React from "react";
import TableRow from "@material-ui/core/TableRow";
import {ContextMenuHandler} from "./MUIDocContextMenu";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {RepoDocInfo} from "../RepoDocInfo";
import isEqual from "react-fast-compare";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import {DocRepoTableRowInner, cells} from "./DocRepoTableRowInner";
import { useDocRepoContextMenu } from "./DocRepoTable2";
import {useMUIHoverListener, MUIHoverStoreProvider} from "../../../../web/js/mui/MUIHoverStore";

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

const Delegate = React.memo(function Delegate(props: IProps) {

    const classes = useStyles();

    const callbacks = useDocRepoCallbacks();
    const {selected, row} = props;

    const contextMenuHandlers = useDocRepoContextMenu();

    // const hoverListener = useMUIHoverListener();
    // {/*{...hoverListener}*/}

    return (
        <TableRow
            {...contextMenuHandlers}
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

            <cells.Check viewID={row.id} selected={props.selected} viewIndex={props.viewIndex}/>

            <DocRepoTableRowInner viewIndex={props.viewIndex}
                                  rawContextMenuHandler={props.rawContextMenuHandler}
                                  row={props.row}/>

        </TableRow>
    );

}, isEqual);

export const DocRepoTableRow = React.memo((props: IProps) => (
    // <MUIHoverStoreProvider initialValue={false}>
    <Delegate {...props}/>
    // </MUIHoverStoreProvider>
));

