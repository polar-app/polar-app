import React from "react";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import { BlockIDStr, useBlocksStore } from "./store/BlocksStore";
import { observer } from "mobx-react-lite"
import { useBlockContextMenu } from "./Block";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            color: theme.palette.text.hint,
            fontSize: '1.0em',
            width: '1.0em',
            height: '1.0em'
        },
    }),
);
interface IProps {
    readonly id: BlockIDStr;
}

export const BlockOverflowButton = observer(function NoteOverflow(props: IProps) {

    const blocksStore = useBlocksStore();
    const classes = useStyles();
    const contextMenuHandlers = useBlockContextMenu();

    const noteActivated = blocksStore.getBlockActivated(props.id);

    const className=clsx(classes.root, 'NoteOverflow');

    if (noteActivated?.block.id !== props.id) {
        return <div className={className}/>;
    }

    return (
        <div>
            <MoreVertIcon onClick={event => contextMenuHandlers.onContextMenu(event)}
                          className={classes.root}/>
        </div>
    );
})

