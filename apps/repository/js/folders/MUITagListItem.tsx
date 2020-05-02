import React, {useCallback} from "react";
import {MUIEfficientCheckbox} from "./MUIEfficientCheckbox";
import {createStyles, fade, makeStyles, Theme} from "@material-ui/core/styles";
import {Tags} from "polar-shared/src/tags/Tags";
import TagID = Tags.TagID;
import isEqual from "react-fast-compare";

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
        active: {
            backgroundColor: fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
        }
    }),
);

interface IProps {
    readonly selected: boolean;
    readonly nodeId: string;
    readonly label: string;
    readonly info: string | number;
    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void
}

export const MUITagListItem = React.memo((props: IProps) => {

    const classes = useStyles();

    // FIXME: the checkbox is painfully slow... a basic <input type=checkbox is
    // way faster... maybe try a fontawesome icon

    // FIXME: change row background color when active

    const classNames = props.selected ? [classes.root, classes.active] : [classes.root];

    const onCheckbox = useCallback((event: React.MouseEvent) => {
        props.selectRow(props.nodeId, event, 'checkbox');
        event.stopPropagation();
    }, []);

    return (
        // <ListItem role={undefined}
        //           dense
        //           button>
        //     <ListItemIcon>
        //         <Checkbox
        //             edge="start"
        //             checked={props.selected}
        //             tabIndex={-1}
        //             disableRipple
        //
        //         />
        //     </ListItemIcon>
        //     <ListItemText id={props.nodeId}
        //                   primary={props.label} />
        //     {/*<ListItemSecondaryAction>*/}
        //
        //     {/*    {props.info}*/}
        //
        //     {/*</ListItemSecondaryAction>*/}
        // </ListItem>

        <div className={classNames.join(' ')}
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
    )

}, isEqual);
