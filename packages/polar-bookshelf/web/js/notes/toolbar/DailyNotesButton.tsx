import {Button, createStyles, makeStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import React from "react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: 38,
        },
    }),
);

export const DailyNotesButton = () => {
    const classes = useStyles();

    return (
        <Link style={{ textDecoration: 'none' }} to="/notes/daily">
            <Button className={classes.root} variant="outlined" disableElevation>Daily Notes</Button>
        </Link>
    );
};
