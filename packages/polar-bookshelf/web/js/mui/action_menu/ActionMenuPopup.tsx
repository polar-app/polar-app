import { observer } from "mobx-react-lite";
import React from "react";
import {useActionMenuStore} from "./ActionStore";
import {ActionMenu} from "./ActionMenu";
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

    const store = useActionMenuStore();
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

            <ActionMenu onAction={store.state.onAction}
                        items={store.state.items}
                        onClose={() => store.setState(undefined)}/>

        </Paper>
    )

});
