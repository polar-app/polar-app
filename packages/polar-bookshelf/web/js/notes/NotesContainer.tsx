import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useContainerStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
        },
    }),
);

const useInnerContainerStyles = makeStyles(() =>
    createStyles({
        noteContentOuter: {
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 26px',
        },
    }),
);

export const NotesContainer: React.FC = deepMemo(function NotesContainer(props)  {

    const classes = useContainerStyles();

    return (
        <div className={clsx(["NotesContainer", classes.root])}>
            {props.children}
        </div>
    )

});

export const NotesInnerContainer: React.FC = ({ children }) => {

    const classes = useInnerContainerStyles();

    return (
        <div className={classes.noteContentOuter}>
            {children}
        </div>
    );
};
