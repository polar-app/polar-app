import {createStyles, makeStyles} from '@material-ui/core';
import React from 'react';
import {CreateNote} from './toolbar/CreateNote';
import {SearchForNote} from "./toolbar/SearchForNote";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: "8px 0",
            "& > * + *": {
                marginLeft: 10,
            }
        },
    }),
);

export const NotesToolbar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CreateNote/>
            <SearchForNote/>
        </div>
    )
};
