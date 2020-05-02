import Typography from "@material-ui/core/Typography";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import isEqual from "react-fast-compare";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            flexGrow: 1,
        },
        info: {
            color: theme.palette.text.hint,
        },
    }),
);
interface IProps {
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
    readonly nodeId: string;
    readonly selected: boolean;
    readonly label: string;
    readonly info?: string | number;
}

export const MUITreeItemLabel = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <div className={classes.root}>

            {/*<Checkbox checked={props.selected}*/}
            {/*          onChange={() => props.onNodeSelectToggle(props.nodeId, 'checkbox')}*/}
            {/*          style={{padding: 0}}*/}

            {/*/>*/}

            <div className={classes.label}
                 onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
                {props.label}
            </div>

            <div className={classes.info}
                 onClick={() => props.onNodeSelectToggle(props.nodeId, 'click')}>
                {props.info}
            </div>

        </div>
    );

}, isEqual);
