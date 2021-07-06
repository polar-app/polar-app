import {Button, createStyles, makeStyles} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: 38,
        },
    }),
);

export const WorkspaceDropdown = () => {
    const classes = useStyles();

    return (
        <Button className={classes.root} variant="outlined" disableElevation>Workspace</Button>
    );
};
