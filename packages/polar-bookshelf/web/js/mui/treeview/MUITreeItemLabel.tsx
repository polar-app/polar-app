import React, {useCallback} from "react";
import isEqual from "react-fast-compare";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {MUIEfficientCheckbox} from "../../../../apps/repository/js/folders/MUIEfficientCheckbox";
import {Tags} from "polar-shared/src/tags/Tags";
import TagID = Tags.TagID;
import {fade} from "@material-ui/core/styles";
import clsx from "clsx";
import {useDragContext} from "../../ui/tree/DragTarget2";
import {useContextMenu} from "../../../../apps/repository/js/doc_repo/MUIContextMenu";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            userSelect: 'none',
            fontSize: '1.1rem',
            display: "flex",
            alignItems: "center",
            // padding: '5px',
            paddingTop: '7px',
            paddingBottom: '7px',
            cursor: 'pointer',
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
        info: {
            color: theme.palette.text.hint,
            paddingRight: '5px',
        },
        checkbox: {
            display: "flex",
            alignItems: "center",
            color: theme.palette.text.secondary,
        },
        /* Pseudo-class applied to the root element if `selected={true}`. */
        selected: {},
        /* Pseudo-class applied to the root element if `drag={true}`. */
        drag: {},
    }),
);
interface IProps {

    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void;

    readonly nodeId: string;
    readonly selected: boolean;
    readonly label: string;
    readonly info?: string | number;

}

export const MUITreeItemLabel = React.memo((props: IProps) => {

    const classes = useStyles();
    const drag = useDragContext();
    const contextMenuCallbacks = useContextMenu();

    const onCheckbox = useCallback((event: React.MouseEvent) => {
        props.selectRow(props.nodeId, event, 'checkbox');
        event.stopPropagation();
    }, []);

    // TODO: double click should expand the node...

    const className = clsx(
        classes.root,
        {
            [classes.selected]: props.selected,
            [classes.drag]: drag.active,
        },
    );

    return (
        <div className={className}
             {...contextMenuCallbacks}
             onClick={event => props.selectRow(props.nodeId, event, 'click')}>

            <div className={classes.checkbox}
                 onClick={event => onCheckbox(event)}>
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
