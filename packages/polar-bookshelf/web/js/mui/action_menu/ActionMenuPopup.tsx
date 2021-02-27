import { observer } from "mobx-react-lite";
import React from "react";
import {useCommandActionMenuStore} from "./ActionStore";
import {ActionMenu} from "./ActionMenu";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            background: theme.palette.background.paper,
            position: 'absolute',
            zIndex: 99999
        },

    }),
);

export const ActionMenuPopup = observer(() => {

    const store = useCommandActionMenuStore();
    const classes = useStyles();

    if (! store.state) {
        return null;
    }

    return (
        <Paper className={classes.root}
               elevation={15}
               style={{
                   top: store.state.position.top,
                   left: store.state.position.left,
               }}>

            <ActionMenu onAction={NULL_FUNCTION} actions={store.state.items} onClose={() => store.setState(undefined)}/>

        </Paper>
    )

});
