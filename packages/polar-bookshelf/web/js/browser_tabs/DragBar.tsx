import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(() => ({

    root: {
        "-webkit-app-region": "drag",
        height: '10px'
    }

}));

/**
 * Used to make the Electron titlebar draggable.
 *
 * https://www.electronjs.org/docs/api/frameless-window
 */
export const DragBar = React.memo(function DragBar() {

    const classes = useStyles();

    return <div className={classes.root}/>
});
