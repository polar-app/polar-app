import React, {useCallback} from "react";
import isEqual from "react-fast-compare";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {MUIEfficientCheckbox} from "../../../../apps/repository/js/folders/MUIEfficientCheckbox";
import {Tags} from "polar-shared/src/tags/Tags";
import TagID = Tags.TagID;

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

    const onCheckbox = useCallback((event: React.MouseEvent) => {
        props.selectRow(props.nodeId, event, 'checkbox');
        event.stopPropagation();
    }, []);

    return (
        <div className={classes.root} onClick={event => props.selectRow(props.nodeId, event, 'click')}>

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
