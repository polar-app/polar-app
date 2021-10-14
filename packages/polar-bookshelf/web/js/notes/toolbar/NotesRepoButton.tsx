import {Button, createStyles, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import React from "react";
import { RoutePathNames } from "../../apps/repository/RoutePathNames";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: 38,
        },
    }),
);

export const NotesRepoButton = () => {
    const classes = useStyles();

    return (
        <Link style={{ textDecoration: 'none' }} to={RoutePathNames.NOTES_REPO}>
            <Button className={classes.root} variant="outlined" disableElevation>All Notes</Button>
        </Link>
    );
};
