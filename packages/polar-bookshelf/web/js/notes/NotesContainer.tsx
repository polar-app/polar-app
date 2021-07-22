import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
        },
    }),
);

export const NotesContainer: React.FC = deepMemo(function NotesContainer(props)  {

    const classes = useStyles();

    return (
        <div className={clsx(["NotesContainer", classes.root])}>
            {props.children}
        </div>
    )

});
