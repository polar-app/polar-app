import {Button, createStyles, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import React from "react";
import { RoutePathnames } from "../../apps/repository/RoutePathnames";

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
        <Link style={{ textDecoration: 'none' }} to={RoutePathnames.NOTES_REPO}>
            <Button className={classes.root} variant="outlined" disableElevation>All Notes</Button>
        </Link>
    );
};
