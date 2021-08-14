import {createStyles, Divider, makeStyles} from '@material-ui/core';
import React from 'react';
import {CreateNote} from './toolbar/CreateNote';
import {SearchForNote} from "./toolbar/SearchForNote";
import {NotesRepoButton} from './toolbar/NotesRepoButton';
import {SidenavTrigger} from '../sidenav/SidenavTrigger';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '0 0 55px',
            height: 55,
            padding: '0 26px',
        },
        divider: {
            padding: '0 26px',
        },
        left: {
            flexShrink: 0,
        },
        right: {
            flexShrink: 0,
        },
        mid: {
            flex: '0 1 522px',
            maxWidth: 522,
            margin: '0 20px',
        }
    }),
);

export const NotesToolbar = () => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <div className={classes.left}>
                    <SidenavTrigger />
                    <NotesRepoButton />
                </div>
                <div className={classes.mid}><SearchForNote /></div>
                <div className={classes.right}><CreateNote /></div>
            </div>
            <div className={classes.divider}><Divider /></div>
        </>
    )
};
