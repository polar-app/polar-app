import Typography from "@material-ui/core/Typography";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import isEqual from "react-fast-compare";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {MUIEfficientCheckbox} from "../../../../apps/repository/js/folders/MUIEfficientCheckbox";


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
            flexGrow: 1,
        },
        info: {
            color: theme.palette.text.hint,
            paddingRight: '5px',
        },
        checkbox: {
            color: theme.palette.text.secondary,
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

            <MUIEfficientCheckbox checked={props.selected}
                                  // FIXME add this back in.
                                  // onChange={() => props.onNodeSelectToggle(props.nodeId, 'checkbox')}
                                  />

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
