import React, {useCallback} from "react";
import {MUIEfficientCheckbox} from "./MUIEfficientCheckbox";
import {createStyles, fade, makeStyles, Theme} from "@material-ui/core/styles";
import {Tags} from "polar-shared/src/tags/Tags";
import isEqual from "react-fast-compare";
import clsx from "clsx";
import {
    DragTarget2,
    useDragContext
} from "../../../../web/js/ui/tree/DragTarget2";
import {useContextMenu} from "../doc_repo/MUIContextMenu";
import TagID = Tags.TagID;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            // color: theme.palette.text.primary,
            userSelect: 'none',
            fontSize: '1.1rem',
            display: "flex",
            alignItems: "center",
            padding: '5px',
            paddingTop: '7px',
            paddingBottom: '7px',
            cursor: 'pointer',

            // background: "#f1f1f1",
            '&:hover': {
                background: theme.palette.action.hover
            },
            '&$selected, &$selected:hover': {
                backgroundColor: fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
            },
            '&$drag, &$drag:hover': {
                // backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),

                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
            },
        },
        label: {
            paddingLeft: '5px',
            flexGrow: 1,
        },
        checkbox: {
            display: "flex",
            alignItems: "center",
        },
        info: {
            color: theme.palette.text.hint,
        },
        /* Pseudo-class applied to the root element if `selected={true}`. */
        selected: {},
        /* Pseudo-class applied to the root element if `drag={true}`. */
        drag: {},
    }),
);

interface IProps {
    readonly selected: boolean;
    readonly nodeId: string;
    readonly label: string;
    readonly info: string | number;
    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void;
    readonly onDrop: (tagID: TagID) => void;
}

export const MUITagListItemInner = React.memo((props: IProps) => {

    const classes = useStyles();

    const drag = useDragContext();

    const onCheckbox = useCallback((event: React.MouseEvent) => {
        props.selectRow(props.nodeId, event, 'checkbox');
        event.stopPropagation();
    }, []);

    const className = clsx(
        classes.root,
        {
            [classes.selected]: props.selected,
            [classes.drag]: drag.active,
        },
    );

    const contextMenu = useContextMenu();

    // TODO: needs tabindex and focus...
    return (
        <div className={className}
             {...contextMenu}
             onClick={(event) => props.selectRow(props.nodeId, event, 'click')}>

            <div onClick={onCheckbox}
                 className={classes.checkbox}>
                <MUIEfficientCheckbox checked={props.selected}/>
            </div>

            <div className={classes.label}>
                {props.label}
            </div>

            <div className={classes.info}>
                {props.info}
            </div>

        </div>
    );

}, isEqual);

export const MUITagListItem = React.memo((props: IProps) => {

    const onDrop = useCallback(() => {
        props.onDrop(props.nodeId)
    }, [])

    return (
        <DragTarget2 onDrop={onDrop}>
            <MUITagListItemInner {...props}/>
        </DragTarget2>
    )

}, isEqual);
